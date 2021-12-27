package com.florence.hikingblogrest;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class HikingBlogRestApplication implements ApplicationRunner {

    private static final Logger LOGGER = LogManager.getLogger(HikingBlogRestApplication.class);
    private static final String DATABASE_URL = "https://hiking-blog-app.firebaseio.com";

    public static void main(String[] args) {
        SpringApplication.run(HikingBlogRestApplication.class, args);
    }

    @Override
    public void run(ApplicationArguments args) {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .setDatabaseUrl(DATABASE_URL)
                        .build();

                FirebaseApp.initializeApp(options);
                LOGGER.info("Initialized Firebase App");
            } catch (IOException e) {
                LOGGER.error("ERROR: invalid service account credentials.");
                LOGGER.error(e.getMessage());
            }
        }
    }
}
