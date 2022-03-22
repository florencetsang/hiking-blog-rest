package com.florence.hikingblogrest.proxy;

import com.florence.hikingblogrest.dto.Trip;

import java.util.List;

public interface BaseDatabaseDAO {

    List<Trip> getTrips(String uid, int tripId);

    int addTrip(String name, String description, String route, List<Integer> tagIds, String uid);

    int deleteTrip(String uid, int tripId);

}
