package com.florence.hikingblogrest.proxy.connectionresolver;

import java.sql.Connection;
import java.sql.SQLException;

public interface ConnectionResolver {

    Connection getConnection() throws SQLException;
}
