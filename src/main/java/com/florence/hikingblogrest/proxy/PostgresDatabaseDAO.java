package com.florence.hikingblogrest.proxy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florence.hikingblogrest.dto.Activity;
import com.florence.hikingblogrest.dto.LatLng;
import com.florence.hikingblogrest.dto.Route;
import com.florence.hikingblogrest.dto.Routes;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PostgresDatabaseDAO implements BaseDatabaseDAO {

    private static final String SQL_SELECT_ALL_POSTS = "SELECT * FROM HIKING_ROUTES WHERE USER_ID=?";
    private static final String SQL_INSERT_POST = "INSERT INTO HIKING_ROUTES (NAME, DESCRIPTION, PATH_COORDINATES, USER_ID) VALUES (?,?,?,?)";
    private static final String SQL_DELETE_POST = "DELETE FROM HIKING_ROUTES WHERE USER_ID=? AND ID=?";
    private static final String CONNECTION_CREATION_LOG = "Created connection: {}";
    private static final Logger LOGGER = LogManager.getLogger(PostgresDatabaseDAO.class);

    private final String url;
    private final String username;
    private final String password;

    public PostgresDatabaseDAO(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }

    @Override
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }

    public Routes getRoutes(String uid) {

        ObjectMapper mapper = new ObjectMapper();
        Routes routes = new Routes();
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(SQL_SELECT_ALL_POSTS)) {
            LOGGER.info(CONNECTION_CREATION_LOG, conn);
            ps.setString(1, uid);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("ID");
                String pathCoordinatesString = rs.getString("PATH_COORDINATES");
                List<LatLng> pathCoordinates = Arrays.asList(mapper.readValue(pathCoordinatesString, LatLng[].class));
                LOGGER.info("Fetch post of user id: {}, id: {}, path coordinates: {}", uid, id, pathCoordinates);
                routes.addRoute(new Route(Integer.toString(id), pathCoordinates));
            }
        } catch (SQLException | JsonProcessingException e) {
            LOGGER.error(e);
        }

        return routes;
    }

    public List<Activity> getPosts(String uid) {

        ObjectMapper mapper = new ObjectMapper();
        List<Activity> activities = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(SQL_SELECT_ALL_POSTS)) {
            LOGGER.info(CONNECTION_CREATION_LOG, conn);
            ps.setString(1, uid);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("ID");
                String name = rs.getString("NAME");
                String description = rs.getString("DESCRIPTION");
                String route = rs.getString("PATH_COORDINATES");

                LOGGER.info("Fetch post of user id: {}, id: {}, name: {}, description: {}, route: {}", uid, id, name, description, route);
                List<LatLng> pathCoordinates = Arrays.asList(mapper.readValue(route, LatLng[].class));
                activities.add(new Activity(id, name, description, pathCoordinates));
            }

        } catch (SQLException | JsonProcessingException e) {
            LOGGER.error(e);
        }

        return activities;
    }

    public void insertPost(String name, String description, String route, String uid) throws SQLException {

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(SQL_INSERT_POST)) {
            LOGGER.info(CONNECTION_CREATION_LOG, conn);
            ps.setString(1, name);
            ps.setString(2, description);
            ps.setString(3, route);
            ps.setString(4, uid);
            ps.execute();
            LOGGER.info("Inserted data to database:: Name: {}. Description: {}. Route: {}. UID: {}", name, description, route, uid);
        }
    }

    public void deletePost(String uid, int id) throws SQLException {

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(SQL_DELETE_POST)) {
            LOGGER.info(CONNECTION_CREATION_LOG, conn);
            ps.setString(1, uid);
            ps.setInt(2, id);
            ps.execute();
            LOGGER.info("Deleted post with uid: [{}], id [{}].", uid, id);
        }
    }

}
