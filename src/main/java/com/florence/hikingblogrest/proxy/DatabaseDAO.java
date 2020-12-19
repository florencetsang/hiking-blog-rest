package com.florence.hikingblogrest.proxy;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.*;

public class DatabaseDAO {

    String sqlSelectAllPersons = "SELECT * FROM hiking_routes";
    String connectionUrl = "jdbc:mysql://localhost:3306/HBA?serverTimezone=UTC";
    private static final Logger LOGGER = LogManager.getLogger(DatabaseDAO.class);

    public void getData() {
        try {
            Connection conn = DriverManager.getConnection(connectionUrl, "springuser", "mER984");
            LOGGER.info("Created connection: {}", conn);
            PreparedStatement ps = conn.prepareStatement(sqlSelectAllPersons);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                long id = rs.getLong("ID");
                String name = rs.getString("NAME");
                String description = rs.getString("cliDESCRIPTION");

                LOGGER.info("Id: {}, name: {}, description: {}", id, name, description);
                // do something with the extracted data...
            }
        } catch (SQLException e) {
            // handle the exception
        }
    }


}
