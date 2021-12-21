package com.florence.hikingblogrest.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florence.hikingblogrest.dto.*;
import com.florence.hikingblogrest.helper.RoutesHelper;
import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.proxy.DatabaseDAO;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.lang.Nullable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.*;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RoutesService {

    private static final Logger LOGGER = LogManager.getLogger(RoutesService.class);

    private final CloudStorageProxy cloudStorageProxy;
    private final String localFolderOverride;
    private final DatabaseDAO databaseDAO;

    public RoutesService(CloudStorageProxy cloudStorageProxy, @Nullable String localFolderOverride, DatabaseDAO databaseDAO) {
        this.cloudStorageProxy = cloudStorageProxy;
        this.localFolderOverride = localFolderOverride;
        this.databaseDAO = databaseDAO;
    }

    public Routes getRoutes() throws FileNotFoundException {
        Map<String, InputStream> routeFiles = fetchRoutesFiles(localFolderOverride);
        Routes routes = new Routes();
        for (Map.Entry<String, InputStream> routeFile : routeFiles.entrySet()) {
            routes.addRoute(new Route(routeFile.getKey(), RoutesHelper.loadGpxData(routeFile.getValue())));
            LOGGER.info("Loaded {}", routeFile.getKey());
        }
        return routes;
    }

    public List<Activity> getActivities(String authToken) throws FirebaseAuthException {
        String uid = getUserIdFromAuthToken(authToken);
        return databaseDAO.getPosts(uid);
    }

    private Map<String, InputStream> fetchRoutesFiles(@Nullable String localFolderOverride) throws FileNotFoundException {
        if (localFolderOverride == null) {
            LOGGER.info("Local folder override is null. Getting routes from cloud storage.");
            return cloudStorageProxy.getAllGpxRoutes();
        } else {
            LOGGER.info("Local folder override is {}. Fetching route files.", localFolderOverride);
            Map<String, InputStream> routeFiles = new HashMap<>();
            File folder = new File(localFolderOverride);
            File[] files = folder.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        routeFiles.put(FilenameUtils.getBaseName(file.getName()), new FileInputStream(file));
                        LOGGER.info("Loaded route file {}", file.getName());
                    }
                }
            }
            return routeFiles;
        }
    }

    public void createPost(HttpServletRequest request) throws IOException, ServletException, SQLException, FirebaseAuthException {

        String name = request.getParameter("name");
        String description = request.getParameter("description");
        Part filePart = request.getPart("file");
        String authToken = request.getParameter("token");
        final String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
        LOGGER.info("Create post endpoint received {}. Name: {}, File: {}, Token:{}, Description: {}", request, name, fileName, authToken, description);

        String uid = getUserIdFromAuthToken(authToken);

        InputStream fileContent = filePart.getInputStream();
        List<LatLng> pathCoordinates = RoutesHelper.loadGpxData(fileContent);

        ObjectMapper objectMapper = new ObjectMapper();
        databaseDAO.insertPost(name, description, objectMapper.writeValueAsString(pathCoordinates), uid);
    }

    public void deletePost (int id) throws SQLException {
        databaseDAO.deletePost(id);
    }

    private String getUserIdFromAuthToken(String authToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(authToken);
        String uid = decodedToken.getUid();
        LOGGER.info("Decoded idToken [{}] to uid [{}]", authToken, uid);
        return uid;
    }
}
