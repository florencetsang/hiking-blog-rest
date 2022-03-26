package com.florence.hikingblogrest.proxy.connectionresolver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * @deprecated Simple connection resolver with no connection pool implementation.
 */
@Deprecated(since = "0.0.5")
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
    public Connection resolveConnection(boolean autoCommit) {

        Connection connection = null;

        try {
            connection = DriverManager.getConnection(url, username, password);
            connection.setAutoCommit(autoCommit);
        } catch (SQLException e) {
            LOGGER.error("Connection Error", e);
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException throwables) {
                    LOGGER.error("Connection close error", e);
                }
            }
        }

        return connection;
    }
}