package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.BaseDatabaseDAO;
import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.proxy.PostgresDatabaseDAO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatasourceConfig {

    @Bean
    public CloudStorageProxy cloudStorageProxy() {
        return new CloudStorageProxy();
    }

    @Bean
    public BaseDatabaseDAO databaseDAO(@Value("${spring.datasource.url}") String url,
                                   @Value("${spring.datasource.username}") String username,
                                   @Value("${spring.datasource.password}") String password) {
        return new PostgresDatabaseDAO(url, username, password);
    }
}
