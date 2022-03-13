package com.florence.hikingblogrest.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florence.hikingblogrest.dto.Activity;
import com.florence.hikingblogrest.dto.LatLng;
import com.florence.hikingblogrest.dto.Route;
import com.florence.hikingblogrest.dto.Routes;
import com.florence.hikingblogrest.helper.RoutesHelper;
import com.florence.hikingblogrest.proxy.BaseDatabaseDAO;
import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.lang.Nullable;

import javax.servlet.http.Part;
import java.io.*;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RoutesService {

    private static final Logger LOGGER = LogManager.getLogger(RoutesService.class);

    private final CloudStorageProxy cloudStorageProxy;
    private final String localFolderOverride;
    private final BaseDatabaseDAO databaseDAO;

    public RoutesService(CloudStorageProxy cloudStorageProxy, @Nullable String localFolderOverride, BaseDatabaseDAO databaseDAO) {
        this.cloudStorageProxy = cloudStorageProxy;
        this.localFolderOverride = localFolderOverride;
        this.databaseDAO = databaseDAO;
    }

    public Routes getRoutes(String uid) {
        return databaseDAO.getRoutes(uid);
    }

    private Routes getRoutesFromFiles() throws FileNotFoundException {
        Map<String, InputStream> routeFiles = fetchRoutesFiles(localFolderOverride);
        Routes routes = new Routes();
        for (Map.Entry<String, InputStream> routeFile : routeFiles.entrySet()) {
            routes.addRoute(new Route(routeFile.getKey(), RoutesHelper.loadGpxData(routeFile.getValue())));
            LOGGER.info("Loaded {}", routeFile.getKey());
        }
        return routes;
    }

    public List<Activity> getActivities(String uid) {
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

    public void createPost(String name, String description, Part filePart, String uid) throws IOException, SQLException {

        InputStream fileContent = filePart.getInputStream();
        List<LatLng> pathCoordinates = RoutesHelper.loadGpxData(fileContent);
        ObjectMapper objectMapper = new ObjectMapper();
        databaseDAO.insertPost(name, description, objectMapper.writeValueAsString(pathCoordinates), uid);
    }

    public void deletePost(String uid, int id) throws SQLException {
        databaseDAO.deletePost(uid, id);
    }

}
