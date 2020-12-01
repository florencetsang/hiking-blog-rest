package com.florence.hikingblogrest.route;

import java.util.List;


public class Route {

    private List<LatLng> pathCoordinates;
    private String key;

    public Route(List<LatLng> pathCoordinates, String key) {
        this.pathCoordinates = pathCoordinates;
        this.key = key;
    }

    public List<LatLng> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
