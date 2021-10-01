package com.florence.hikingblogrest.dto;

import java.util.List;


public class PathCoordinates {

    private List<LatLng> pathCoordinates;

    public PathCoordinates(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }

    public List<LatLng> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }

}
