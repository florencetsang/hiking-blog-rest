package com.florence.hikingblogrest.route;

import java.util.List;


public class Route {

    private List<LatLng> pathCoordinates;

    public List<LatLng> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }

    public Route(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }
}
