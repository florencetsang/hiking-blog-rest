package com.florence.hikingblogrest.proxy.connectionresolver;

import java.sql.Connection;

public interface ConnectionResolver {

    Connection getConnection();
}
