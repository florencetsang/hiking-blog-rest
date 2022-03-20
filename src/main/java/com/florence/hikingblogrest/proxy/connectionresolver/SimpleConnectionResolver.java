package com.florence.hikingblogrest.proxy.connectionresolver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Deprecated
public class SimpleConnectionResolver implements ConnectionResolver {
    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleConnectionResolver.class);

    private final String url;
    private final String username;
    private final String password;

    public SimpleConnectionResolver(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }

    @Override
    public Connection getConnection() {
        try {
            return DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            LOGGER.error("Cannot get connection", e);
            return null;
        }
    }
}