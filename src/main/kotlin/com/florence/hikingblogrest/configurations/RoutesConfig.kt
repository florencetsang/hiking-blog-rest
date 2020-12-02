package com.florence.hikingblogrest.configurations

import com.florence.hikingblogrest.proxy.CloudStorageProxy
import com.florence.hikingblogrest.route.RoutesController
import com.florence.hikingblogrest.route.RoutesService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
open class RoutesConfig {
    @Bean
    open fun cloudStorageProxy(): CloudStorageProxy {
        return CloudStorageProxy()
    }

    @Bean
    open fun routesService(cloudStorageProxy: CloudStorageProxy): RoutesService {
        return RoutesService(cloudStorageProxy)
    }

    @Bean
    open fun routesController(routesService: RoutesService): RoutesController {
        return RoutesController(routesService)
    }
}