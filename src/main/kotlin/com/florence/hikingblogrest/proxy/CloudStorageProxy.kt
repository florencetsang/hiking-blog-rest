package com.florence.hikingblogrest.proxy

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.apache.commons.io.FilenameUtils
import org.apache.logging.log4j.LogManager
import java.io.ByteArrayInputStream
import java.io.IOException
import java.io.InputStream
import java.util.*

class CloudStorageProxy {
    fun initializeFirebase() {
        try {
            val options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .setDatabaseUrl(DATABASE_URL)
                    .build()
            FirebaseApp.initializeApp(options)
        } catch (e: IOException) {
            LOGGER.error("ERROR: invalid service account credentials.")
            LOGGER.error(e.message)
        }
    }

    val allGpxRoutes: Map<String, InputStream>
        get() {
            val gpxRoutes: MutableMap<String, InputStream> = HashMap()
            val storage = StorageOptions.newBuilder().setProjectId("hiking-blog-app").build().service
            val bucket = storage["hiking-blog-app.appspot.com"]
            val blobs = bucket.list(
                    Storage.BlobListOption.prefix("routes/"),
                    Storage.BlobListOption.currentDirectory())
            for (blob in blobs.iterateAll()) {
                LOGGER.debug(blob.name)
                if (blob.name.endsWith(".gpx")) {
                    gpxRoutes[FilenameUtils.getBaseName(blob.name)] = ByteArrayInputStream(blob.getContent())
                }
            }
            return gpxRoutes
        }

    companion object {
        private val LOGGER = LogManager.getLogger(CloudStorageProxy::class.java)
        private const val DATABASE_URL = "https://hiking-blog-app.firebaseio.com"
    }

    init {
        initializeFirebase()
    }
}