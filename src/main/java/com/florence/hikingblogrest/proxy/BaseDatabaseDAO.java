package com.florence.hikingblogrest.proxy;

import com.florence.hikingblogrest.dto.Trip;

import java.util.Date;
import java.util.List;

public interface BaseDatabaseDAO {

    List<Trip> getTrips(String uid, int tripId);

    int addTrip(String name, String description, String route, List<Integer> tagIds, String uid, Date fromDate, Date toDate);

    int deleteTrip(String uid, int tripId);

    int editTrip(String uid, int tripId, String name, String description, List<Integer> tagIds, Date fromDate, Date toDate);
}
