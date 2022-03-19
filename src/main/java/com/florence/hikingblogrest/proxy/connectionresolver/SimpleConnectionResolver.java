package com.florence.hikingblogrest.proxy.connectionresolver;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SimpleConnectionResolver implements ConnectionResolver {

    private final String url;
    private final String username;
    private final String password;

    public SimpleConnectionResolver(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }

    @Override
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
}