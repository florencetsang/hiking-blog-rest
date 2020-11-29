package com.florence.hikingblogrest.route;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jdom2.*;
import org.jdom2.input.SAXBuilder;


public class Route {

    private List<LatLng> pathCoordinates;

    public List<LatLng> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }
//
//    public Route() {
//        this.pathCoordinates = loadGpxData();
//    }

    public Route(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }
}
