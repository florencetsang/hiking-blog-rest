package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.proxy.DatabaseDAO;
import com.florence.hikingblogrest.rest.RoutesController;
import com.florence.hikingblogrest.rest.RoutesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoutesConfig {

    @Bean
    public CloudStorageProxy cloudStorageProxy() {
        return new CloudStorageProxy();
    }

    @Bean
    public DatabaseDAO databaseDAO(@Value("{spring.datasource.url}") String url, @Value("{spring.datasource.username}") String username, @Value("{spring.datasource.password}") String password) {
        return new DatabaseDAO(url, username, password);
    }

    @Bean
    public RoutesService routesService(CloudStorageProxy cloudStorageProxy, @Value("${profileLocation:#{null}}") String localFolderOverride, DatabaseDAO databaseDAO) {
        return new RoutesService(cloudStorageProxy, localFolderOverride, databaseDAO);
    }

    @Bean
    public RoutesController routesController(RoutesService routesService) {
        return new RoutesController(routesService);
    }
}
