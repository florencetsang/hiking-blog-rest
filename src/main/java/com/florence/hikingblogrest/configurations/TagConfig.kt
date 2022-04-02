package com.florence.hikingblogrest.configurations

import com.florence.hikingblogrest.dto.TagRepo
import com.florence.hikingblogrest.proxy.TagDAO
import com.florence.hikingblogrest.proxy.connectionresolver.ConnectionResolver
import com.florence.hikingblogrest.service.TagService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TagConfig {
    @Bean
    fun tagDAO(connectionResolver: ConnectionResolver): TagDAO {
        return TagDAO(connectionResolver)
    }

    @Bean
    fun tagService(tagRepo: TagRepo): TagService {
        return TagService(tagRepo)
    }
}
