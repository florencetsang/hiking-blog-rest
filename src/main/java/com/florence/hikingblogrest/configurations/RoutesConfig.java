package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.*;
import com.florence.hikingblogrest.proxy.connectionresolver.ConnectionResolver;
import com.florence.hikingblogrest.service.TripService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoutesConfig {
    @Bean
    public BaseDatabaseDAO databaseDAO(ConnectionResolver connectionResolver, TagDAO tagDAO) {
        return new PostgresDatabaseDAO(connectionResolver, tagDAO);
    }

    @Bean
    public TripService tripService(CloudStorageProxy cloudStorageProxy, BaseDatabaseDAO databaseDAO) {
        return new TripService(cloudStorageProxy, databaseDAO);
    }
}
