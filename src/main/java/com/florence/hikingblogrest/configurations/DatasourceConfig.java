package com.florence.hikingblogrest.configurations;

import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import com.florence.hikingblogrest.proxy.connectionresolver.ConnectionResolver;
import com.florence.hikingblogrest.proxy.connectionresolver.ConnectionResolverImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatasourceConfig {

    @Bean
    public CloudStorageProxy cloudStorageProxy() {
        return new CloudStorageProxy();
    }

    @Bean
    public ConnectionResolver connectionResolver(DataSource dataSource) {
        return new ConnectionResolverImpl(dataSource);
    }
}
