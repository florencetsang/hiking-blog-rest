package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.route.RoutesController;
import com.florence.hikingblogrest.route.RoutesService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoutesConfig {

    @Bean
    public RoutesService routesService(){
        return new RoutesService();
    }

    @Bean
    public RoutesController routesController(RoutesService routesService){
        return new RoutesController(routesService);
    }
}
