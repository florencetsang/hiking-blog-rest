package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.BaseDatabaseDAO;
import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.rest.RoutesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoutesConfig {

    @Bean
    public RoutesService routesService(CloudStorageProxy cloudStorageProxy, @Value("${profileLocation:#{null}}") String localFolderOverride, BaseDatabaseDAO databaseDAO) {
        return new RoutesService(cloudStorageProxy, localFolderOverride, databaseDAO);
    }

}
