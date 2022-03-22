package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.BaseDatabaseDAO;
import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.proxy.PostgresDatabaseDAO;
import com.florence.hikingblogrest.proxy.TagDAO;
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
