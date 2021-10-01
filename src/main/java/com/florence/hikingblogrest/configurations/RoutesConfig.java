package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.route.RoutesController;
import com.florence.hikingblogrest.route.RoutesService;
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
    public RoutesService routesService(CloudStorageProxy cloudStorageProxy, @Value("${profileLocation}") String localFolderOverride) {
        return new RoutesService(cloudStorageProxy, localFolderOverride);
    }

    @Bean
    public RoutesController routesController(RoutesService routesService) {
        return new RoutesController(routesService);
    }
}
