package com.florence.hikingblogrest.proxy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florence.hikingblogrest.dto.Activity;
import com.florence.hikingblogrest.dto.LatLng;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DatabaseDAO {

    private static final String SQL_SELECT_ALL_POSTS = "SELECT * FROM hiking_routes";
    private static final String SQL_INSERT_POST = "INSERT INTO HBA.HIKING_ROUTES (NAME, DESCRIPTION, PATH_COORDINATES) VALUES (?,?,?)";
    private static final String SQL_DELETE_POST = "DELETE FROM HBA.HIKING_ROUTES WHERE ID=?";
    private static final String CONNECTION_URL = "jdbc:mysql://localhost:3306/HBA?serverTimezone=UTC";
    private static final Logger LOGGER = LogManager.getLogger(DatabaseDAO.class);

    public List<Activity> getPosts() {

        ObjectMapper mapper = new ObjectMapper();
        List<Activity> activities = new ArrayList<>();
        try {
            Connection conn = DriverManager.getConnection(CONNECTION_URL, "springuser", "mER984");
            LOGGER.info("Created connection: {}", conn);
            PreparedStatement ps = conn.prepareStatement(SQL_SELECT_ALL_POSTS);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("ID");
                String name = rs.getString("NAME");
                String description = rs.getString("DESCRIPTION");
                String route = rs.getString("PATH_COORDINATES");

                LOGGER.info("Id: {}, name: {}, description: {}, route: {}", id, name, description, route);
                List<LatLng> pathCoordinates = Arrays.asList(mapper.readValue(route, LatLng[].class));
                activities.add(new Activity(id, name, description, pathCoordinates));
            }
        } catch (SQLException | JsonProcessingException e) {
            LOGGER.error(e);
        }

        return activities;
    }

    public void insertPost(String name, String description, String route) throws SQLException {
        Connection conn = DriverManager.getConnection(CONNECTION_URL, "springuser", "mER984");
        LOGGER.info("Created connection: {}", conn);
        PreparedStatement ps = conn.prepareStatement(SQL_INSERT_POST);
        ps.setString(1, name);
        ps.setString(2, description);
        ps.setString(3, route);
        ps.execute();
        LOGGER.info("Inserted data to database:: Name: {}. Description: {}. Route: {}", name, description, route);
        conn.close();
        LOGGER.info("Connection closed");
    }

    public void deletePost(int id) throws SQLException {
        Connection conn = DriverManager.getConnection(CONNECTION_URL, "springuser", "mER984");
        LOGGER.info("Created connection: {}", conn);
        PreparedStatement ps = conn.prepareStatement(SQL_DELETE_POST);
        ps.setInt(1, id);
        ps.execute();
        LOGGER.info("Deleted post with id {}.", id);
        conn.close();
        LOGGER.info("Connection closed");
    }


}
