package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.route.RoutesController;
import com.florence.hikingblogrest.route.RoutesService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoutesConfig {

    @Bean
    public CloudStorageProxy cloudStorageProxy() {
        return new CloudStorageProxy();
    }

    @Bean
    public RoutesService routesService(CloudStorageProxy cloudStorageProxy) {
        return new RoutesService(cloudStorageProxy);
    }

    @Bean
    public RoutesController routesController(RoutesService routesService) {
        return new RoutesController(routesService);
    }
}
