package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.proxy.connectionresolver.ConnectionResolver;
import com.florence.hikingblogrest.proxy.connectionresolver.DBCPConnectionResolver;
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
    public ConnectionResolver connectionResolver(@Value("${spring.datasource.url}") String url,
                                                 @Value("${spring.datasource.username}") String username,
                                                 @Value("${spring.datasource.password}") String password,
                                                 @Value("${dbcp.min.idle}") int minIdle,
                                                 @Value("${dbcp.max.idle}") int maxIdle,
                                                 @Value("${dbcp.maxWaitMillis}") int maxWaitMillis) {
        return new DBCPConnectionResolver(url, username, password, minIdle, maxIdle, maxWaitMillis);
    }
}
