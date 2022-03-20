package com.florence.hikingblogrest.proxy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florence.hikingblogrest.dto.Trip;
import com.florence.hikingblogrest.dto.LatLng;
import com.florence.hikingblogrest.dto.Tag;
import com.florence.hikingblogrest.proxy.connectionresolver.ConnectionResolver;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PostgresDatabaseDAO implements BaseDatabaseDAO {
    private static final Logger LOGGER = LogManager.getLogger(PostgresDatabaseDAO.class);

    private final ConnectionResolver connectionResolver;
    private final TagDAO tagDAO;
    private final ObjectMapper objectMapper;

    public PostgresDatabaseDAO(ConnectionResolver connectionResolver, TagDAO tagDAO) {
        this.connectionResolver = connectionResolver;
        this.tagDAO = tagDAO;
        objectMapper = new ObjectMapper();
    }

    @Override
    public List<Trip> getTrips(String uid, int tripId) {
        List<Trip> activities = new ArrayList<>();

        try (Connection connection = connectionResolver.getConnection()) {
            final StringBuilder sqlStringBuilder = new StringBuilder();
            sqlStringBuilder.append("SELECT * FROM HIKING_ROUTES WHERE USER_ID = ?");
            if (tripId >= 0) {
                sqlStringBuilder.append(" AND ID = ?");
            }

            try (PreparedStatement preparedStatement = connection.prepareStatement(sqlStringBuilder.toString())) {
                int stmtParamIdx = 1;
                preparedStatement.setString(stmtParamIdx++, uid);
                if (tripId >= 0) {
                    preparedStatement.setInt(stmtParamIdx++, tripId);
                }
                final ResultSet resultSet = preparedStatement.executeQuery();

                while (resultSet.next()) {
                    final int id = resultSet.getInt("ID");
                    final String name = resultSet.getString("NAME");
                    final String description = resultSet.getString("DESCRIPTION");
                    final String routeStr = resultSet.getString("PATH_COORDINATES");
                    final List<LatLng> pathCoordinates = Arrays.asList(objectMapper.readValue(routeStr, LatLng[].class));

                    final List<Tag> tags = tagDAO.getTripTags(uid, id);

                    final Trip.TripBuilder tripBuilder = new Trip.TripBuilder();
                    tripBuilder.key(id)
                            .name(name)
                            .description(description)
                            .pathCoordinates(pathCoordinates)
                            .tags(tags);
                    activities.add(tripBuilder.build());
                }
            } catch (SQLException | JsonProcessingException e) {
                LOGGER.error("getTrips error", e);
                activities = new ArrayList<>();
            }
        } catch (SQLException e) {
            LOGGER.error("connection error", e);
        }
        return activities;
    }

    @Override
    public int addTrip(String name, String description, String route, List<Integer> tagIds, String uid) {
        int newTripId = -1;

        try (Connection connection = connectionResolver.getConnection()) {
            try (PreparedStatement insertTripStmt = connection.prepareStatement("INSERT INTO HIKING_ROUTES (NAME, DESCRIPTION, PATH_COORDINATES, USER_ID) VALUES (?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
                 PreparedStatement addTagStmt = connection.prepareStatement("INSERT INTO TRIP_TAG (USER_ID, TRIP_ID, TAG_ID) VALUES (?, ?, ?)")) {
                // start transaction, autoCommit is NOT reset after this method exits
                connection.setAutoCommit(false);

                // insert trip
                insertTripStmt.setString(1, name);
                insertTripStmt.setString(2, description);
                insertTripStmt.setString(3, route);
                insertTripStmt.setString(4, uid);
                int addedRowsCnt = insertTripStmt.executeUpdate();

                if (addedRowsCnt >= 0) {
                    // get new trip ID
                    try (ResultSet generatedKeys = insertTripStmt.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            newTripId = generatedKeys.getInt(1);
                        } else {
                            LOGGER.info("cannot get new trip ID");
                            newTripId = -1;
                        }
                    }

                    if (newTripId >= 0) {
                        // insert tags
                        for (int tagId : tagIds) {
                            addTagStmt.setString(1, uid);
                            addTagStmt.setInt(2, newTripId);
                            addTagStmt.setInt(3, tagId);
                            addTagStmt.addBatch();
                        }
                        addTagStmt.executeBatch();
                    }

                } else {
                    LOGGER.info("no record is added");
                    newTripId = -1;
                }

                // commit transaction
                connection.commit();
            } catch (SQLException e) {
                LOGGER.error("add trip error", e);
                newTripId = -1;
            }

            // rollback if trip records are not updated
            if (newTripId < 0) {
                LOGGER.info("rollback addTrip, newTripId: {}", newTripId);
                try {
                    connection.rollback();
                } catch (SQLException e) {
                    LOGGER.error("rollback addTrip error", e);
                }
            }
        } catch (SQLException e) {
            LOGGER.error("connection error", e);
        }

        LOGGER.info("newTripId: {}", newTripId);
        return newTripId;
    }

    @Override
    public int deleteTrip(String uid, int tripId) {
        int deletedTripId = -1;

        try (Connection connection = connectionResolver.getConnection()) {
            try (PreparedStatement deleteTagStmt = connection.prepareStatement("DELETE FROM TRIP_TAG WHERE USER_ID = ? AND TRIP_ID = ?");
                 PreparedStatement deleteTripStmt = connection.prepareStatement("DELETE FROM HIKING_ROUTES WHERE USER_ID = ? AND ID = ?")) {
                // start transaction, autoCommit is NOT reset after this method exits
                connection.setAutoCommit(false);

                // delete tags
                deleteTagStmt.setString(1, uid);
                deleteTagStmt.setInt(2, tripId);
                deleteTagStmt.executeUpdate();

                // delete activity
                deleteTripStmt.setString(1, uid);
                deleteTripStmt.setInt(2, tripId);
                final int deletedRowsCount = deleteTripStmt.executeUpdate();

                // commit transaction
                connection.commit();

                deletedTripId = deletedRowsCount > 0 ? tripId : -1;
            } catch (SQLException e) {
                LOGGER.error("deleteTrip error", e);
                deletedTripId = -1;
            }

            // rollback if trip records are not updated
            if (deletedTripId < 0) {
                LOGGER.info("rollback deleteTrip, deletedTripId: {}", deletedTripId);
                try {
                    connection.rollback();
                } catch (SQLException e) {
                    LOGGER.error("rollback deleteTrip error", e);
                }
            }
        } catch (SQLException e) {
            LOGGER.error("connection error", e);
        }

        LOGGER.info("deletedTripId: {}", deletedTripId);
        return deletedTripId;
    }
}
