package com.florence.hikingblogrest.proxy;

import com.google.api.gax.paging.Page;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class CloudStorageProxy {

    private static final Logger LOGGER = LogManager.getLogger(CloudStorageProxy.class);
    private static final String PROJECT_ID = "hiking-blog-app";
    private static final String BUCKET_ID = "hiking-blog-app.appspot.com";

    public CloudStorageProxy() {
    }

    public Map<String, InputStream> getAllGpxRoutes() {

        Map<String, InputStream> gpxRoutes = new HashMap<>();

        Storage storage = StorageOptions.newBuilder().setProjectId(PROJECT_ID).build().getService();
        Bucket bucket = storage.get(BUCKET_ID);

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
