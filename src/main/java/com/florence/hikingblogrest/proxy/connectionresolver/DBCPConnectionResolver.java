package com.florence.hikingblogrest.proxy.connectionresolver;

import org.apache.commons.dbcp2.BasicDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public class DBCPConnectionResolver implements ConnectionResolver {

    private static final BasicDataSource ds = new BasicDataSource();

    public DBCPConnectionResolver(String url, String username, String password) {
        ds.setUrl(url);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setMinIdle(5);
        ds.setMaxIdle(10);
        ds.setMaxOpenPreparedStatements(100);
    }

    @Override
    public Connection getConnection() throws SQLException {
        return ds.getConnection();
    }
}