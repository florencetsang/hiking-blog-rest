package com.florence.hikingblogrest.proxy.connectionresolver;

import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.SQLException;

public class DBCPConnectionResolver implements ConnectionResolver {

    private static final Logger LOGGER = LogManager.getLogger(DBCPConnectionResolver.class);

    private final BasicDataSource ds = new BasicDataSource();

    public DBCPConnectionResolver(String url, String username, String password, int minIdle, int maxIdle, int maxWaitMillis) {
        ds.setUrl(url);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setMinIdle(minIdle);
        ds.setMaxIdle(maxIdle);
        ds.setMaxWaitMillis(maxWaitMillis);
//        ds.setMaxOpenPreparedStatements(100);

        LOGGER.info("Created DBCPConnectionResolver. Url: [{}] MinIdle: [{}] MaxIdle: [{}] maxWaitMillis: [{}]", url, minIdle, maxIdle, maxWaitMillis);
    }

    @Override
    public Connection resolveConnection(boolean autoCommit) {

        Connection connection = null;

        try {
            connection = ds.getConnection();
            connection.setAutoCommit(autoCommit);

        } catch (SQLException e) {
            LOGGER.error("DBCP Connection Error", e);
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