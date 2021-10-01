package com.florence.hikingblogrest.dto;

import java.util.List;


public class Route {

    private String key;
    private List<LatLng> pathCoordinates;

    public Route(String key, List<LatLng> pathCoordinates) {
        this.key = key;
        this.pathCoordinates = pathCoordinates;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public List<LatLng> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }

}
