package com.florence.hikingblogrest.service;

import com.florence.hikingblogrest.dto.*;
import com.florence.hikingblogrest.helper.RoutesHelper;
import com.florence.hikingblogrest.proxy.BaseDatabaseDAO;
import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.lang.Nullable;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class TripService {
    private static final Logger LOGGER = LogManager.getLogger(TripService.class);

    private final CloudStorageProxy cloudStorageProxy;
    private final BaseDatabaseDAO databaseDAO;

    public TripService(CloudStorageProxy cloudStorageProxy, BaseDatabaseDAO databaseDAO) {
        this.cloudStorageProxy = cloudStorageProxy;
        this.databaseDAO = databaseDAO;
    }

    public List<Trip> getTrips(String uid) {
        return databaseDAO.getTrips(uid, -1);
    }

    public Trip getTrip(String uid, int activityId) {
        final List<Trip> posts = databaseDAO.getTrips(uid, activityId);
        if (posts == null || posts.size() == 0) {
            return null;
        }
        return posts.get(0);
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

    public int addTrip(String name, String description, InputStream routeInputStream, List<Integer> tagIds, String uid) {
        final Optional<String> routeStr = RoutesHelper.getRouteStr(routeInputStream);
        if (routeStr.isEmpty()) {
            return -1;
        }
        final int addedId = databaseDAO.addTrip(name, description, routeStr.get(), tagIds, uid);
        return addedId;
    }

    public int deleteTrip(String uid, int tripId) {
        final int deletedId = databaseDAO.deleteTrip(uid, tripId);
        return deletedId;
    }
}
