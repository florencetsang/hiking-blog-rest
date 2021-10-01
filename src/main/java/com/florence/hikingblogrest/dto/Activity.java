package com.florence.hikingblogrest.dto;

import java.util.List;

public class Activity {

    private Integer key;
    private String name;
    private String description;
    private List<LatLng> pathCoordinates;

    public Activity(Integer key, String name, String description, List<LatLng> pathCoordinates) {
        this.key = key;
        this.name = name;
        this.description = description;
        this.pathCoordinates = pathCoordinates;
    }

    public Integer getKey() {
        return key;
    }

    public void setKey(Integer key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<LatLng> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }
}
