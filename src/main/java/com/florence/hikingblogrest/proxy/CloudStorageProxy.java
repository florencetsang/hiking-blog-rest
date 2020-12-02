package com.florence.hikingblogrest.proxy;

import com.google.api.gax.paging.Page;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class CloudStorageProxy {

    private static final Logger LOGGER = LogManager.getLogger(CloudStorageProxy.class);
    private static final String DATABASE_URL = "https://hiking-blog-app.firebaseio.com";

    public CloudStorageProxy() {
        initializeFirebase();
    }

    public void initializeFirebase() {
        try {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .setDatabaseUrl(DATABASE_URL)
                    .build();

            FirebaseApp.initializeApp(options);
        } catch (IOException e) {
            LOGGER.error("ERROR: invalid service account credentials.");
            LOGGER.error(e.getMessage());
        }
    }

    public Map<String, InputStream> getAllGpxRoutes() {

        Map<String, InputStream> gpxRoutes = new HashMap<>();

        Storage storage = StorageOptions.newBuilder().setProjectId("hiking-blog-app").build().getService();
        Bucket bucket = storage.get("hiking-blog-app.appspot.com");

        Page<Blob> blobs =
                bucket.list(
                        Storage.BlobListOption.prefix("routes/"),
                        Storage.BlobListOption.currentDirectory());

        for (Blob blob : blobs.iterateAll()) {
            LOGGER.debug(blob.getName());
            if (blob.getName().endsWith(".gpx")) {
                gpxRoutes.put(FilenameUtils.getBaseName(blob.getName()), new ByteArrayInputStream(blob.getContent()));
            }
        }
        return gpxRoutes;
    }
}
