package com.florence.hikingblogrest.proxy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florence.hikingblogrest.dto.LatLng;
import com.florence.hikingblogrest.dto.Tag;
import com.florence.hikingblogrest.dto.Trip;
import com.florence.hikingblogrest.proxy.connectionresolver.ConnectionResolver;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

public class PostgresDatabaseDAO implements BaseDatabaseDAO {
    private static final Logger LOGGER = LogManager.getLogger(PostgresDatabaseDAO.class);

    private final ConnectionResolver connectionResolver;
    private final TagDAO tagDAO;
    private final ObjectMapper objectMapper;

    private static final String GET_TRIP = "INSERT INTO HIKING_ROUTES (NAME, DESCRIPTION, PATH_COORDINATES, USER_ID, FROM_DATE, TO_DATE) VALUES (?, ?, ?, ?, ?, ?)";
    private static final String DELETE_TRIP = "DELETE FROM HIKING_ROUTES WHERE USER_ID = ? AND ID = ?";
    private static final String UPDATE_TRIP = "UPDATE HIKING_ROUTES SET NAME = ? , DESCRIPTION = ? , FROM_DATE = ? , TO_DATE = ? WHERE USER_ID = ? AND ID = ?";
    private static final String DELETE_TAGS = "DELETE FROM TRIP_TAG WHERE USER_ID = ? AND TRIP_ID = ?";
    private static final String INSERT_TAGS = "INSERT INTO TRIP_TAG (USER_ID, TRIP_ID, TAG_ID) VALUES (?, ?, ?)";

    private static final String CONNECTION_ERROR = "connection error";

    public PostgresDatabaseDAO(ConnectionResolver connectionResolver, TagDAO tagDAO) {
        this.connectionResolver = connectionResolver;
        this.tagDAO = tagDAO;
        objectMapper = new ObjectMapper();
    }

    @Override
    public List<Trip> getTrips(String uid, int tripId) {
        List<Trip> activities = new ArrayList<>();

        final StringBuilder sqlStringBuilder = new StringBuilder();
        sqlStringBuilder.append("SELECT * FROM HIKING_ROUTES WHERE USER_ID = ?");
        if (tripId >= 0) {
            sqlStringBuilder.append(" AND ID = ?");
        }

        try (Connection connection = connectionResolver.resolveConnection(true);
             PreparedStatement preparedStatement = connection.prepareStatement(sqlStringBuilder.toString())) {
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
                final Timestamp fromDate = resultSet.getTimestamp("FROM_DATE");
                final Timestamp toDate = resultSet.getTimestamp("TO_DATE");

                final List<Tag> tags = tagDAO.getTripTags(uid, id);

                final Trip.TripBuilder tripBuilder = new Trip.TripBuilder();
                tripBuilder.key(id)
                        .name(name)
                        .description(description)
                        .pathCoordinates(pathCoordinates)
                        .tags(tags)
                        .fromDate(fromDate)
                        .toDate(toDate);
                activities.add(tripBuilder.build());
            }
        } catch (SQLException | JsonProcessingException e) {
            LOGGER.error("getTrips error", e);
            activities = new ArrayList<>();
        }
        return activities;
    }

    @Override
    public int addTrip(String name, String description, String route, List<Integer> tagIds, String uid, Date fromDate, Date toDate) {
        final Connection connection = connectionResolver.resolveConnection(false);
        final int newTripId = addTrip(name, description, route, tagIds, uid, fromDate, toDate, connection);
        closeConnection(connection);
        return newTripId;
    }

    @Override
    public int deleteTrip(String uid, int tripId) {
        final Connection connection = connectionResolver.resolveConnection(false);
        final int deletedTripId = deleteTrip(connection, uid, tripId);
        closeConnection(connection);
        return deletedTripId;
    }

    @Override
    public int editTrip(String uid, int tripId, String name, String description, List<Integer> tagIds, Date fromDate, Date toDate) {
        final Connection connection = connectionResolver.resolveConnection(false);
        final int editedTripId = editTrip(uid, tripId, name, description, tagIds, fromDate, toDate, connection);
        closeConnection(connection);
        return editedTripId;
    }

    private int addTrip(String name, String description, String route, List<Integer> tagIds, String uid, Date fromDate, Date toDate, Connection connection) {

        int newTripId = -1;

        if (connection != null) {
            try (PreparedStatement insertTripStmt = connection.prepareStatement(GET_TRIP, Statement.RETURN_GENERATED_KEYS)) {

                // insert trip
                insertTripStmt.setString(1, name);
                insertTripStmt.setString(2, description);
                insertTripStmt.setString(3, route);
                insertTripStmt.setString(4, uid);
                insertTripStmt.setTimestamp(5, new Timestamp(fromDate.getTime()));
                insertTripStmt.setTimestamp(6, new Timestamp(toDate.getTime()));
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
                        insertTags(tagIds, uid, newTripId, connection);
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
        }
        LOGGER.info("newTripId: {}", newTripId);
        return newTripId;
    }

    private int deleteTrip(Connection connection, String uid, int tripId) {

        int deletedTripId = -1;

        if (connection != null) {
            try (PreparedStatement deleteTripStmt = connection.prepareStatement(DELETE_TRIP)) {

                // delete tags
                deleteTags(uid, tripId, connection);

                // delete trip
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
        }
        LOGGER.info("deletedTripId: {}", deletedTripId);
        return deletedTripId;
    }

    private int editTrip(String uid, int tripId, String name, String description, List<Integer> tagIds, Date fromDate, Date toDate, Connection connection) {

        int editedTripId = -1;

        if (connection != null) {
            try (PreparedStatement updateTripStmt = connection.prepareStatement(UPDATE_TRIP, Statement.RETURN_GENERATED_KEYS)) {

                // update trip
                updateTripStmt.setString(1, name);
                updateTripStmt.setString(2, description);
                updateTripStmt.setTimestamp(3, new Timestamp(fromDate.getTime()));
                updateTripStmt.setTimestamp(4, new Timestamp(toDate.getTime()));
                updateTripStmt.setString(5, uid);
                updateTripStmt.setInt(6, tripId);
                final int editedRowsCnt = updateTripStmt.executeUpdate();


                deleteTags(uid, tripId, connection);

                insertTags(tagIds, uid, tripId, connection);

                // commit transaction
                connection.commit();

                editedTripId = editedRowsCnt > 0 ? tripId : -1;

            } catch (SQLException e) {
                LOGGER.error("edit trip error", e);
                editedTripId = -1;
            }

            // rollback if trip records are not updated
            if (editedTripId < 0) {
                LOGGER.info("rollback editTrip, editedTripId: {}", editedTripId);
                try {
                    connection.rollback();
                } catch (SQLException e) {
                    LOGGER.error("rollback editTrip error", e);
                }
            }
        }
        LOGGER.info("editedTripId: {}", editedTripId);
        return editedTripId;
    }

    private void deleteTags(String uid, int tripId, Connection connection) throws SQLException {
        try (PreparedStatement deleteTagStmt = connection.prepareStatement(DELETE_TAGS)) {
            deleteTagStmt.setString(1, uid);
            deleteTagStmt.setInt(2, tripId);
            deleteTagStmt.executeUpdate();
        }
    }

    private void insertTags(List<Integer> tagIds, String uid, int newTripId, Connection connection) throws SQLException {
        try (PreparedStatement addTagStmt = connection.prepareStatement(INSERT_TAGS)) {
            for (int tagId : tagIds) {
                addTagStmt.setString(1, uid);
                addTagStmt.setInt(2, newTripId);
                addTagStmt.setInt(3, tagId);
                addTagStmt.addBatch();
            }
            addTagStmt.executeBatch();
        }
    }

    private void closeConnection(Connection connection) {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            LOGGER.error(CONNECTION_ERROR, e);
        }
    }
}
