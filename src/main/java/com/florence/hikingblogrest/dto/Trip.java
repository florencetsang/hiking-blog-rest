package com.florence.hikingblogrest.dto;

import java.util.ArrayList;
import java.util.List;

public class Trip {

    private int key;
    private String name;
    private String description;
    private List<LatLng> pathCoordinates;
    private List<Tag> tags;

    public Trip(
            int key,
            String name,
            String description,
            List<LatLng> pathCoordinates,
            List<Tag> tags) {
        this.key = key;
        this.name = name;
        this.description = description;
        this.pathCoordinates = pathCoordinates;
        this.tags = tags;
    }

    public int getKey() {
        return key;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<LatLng> getPathCoordinates() {
        return pathCoordinates;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public static class TripBuilder {
        private int key = -1;
        private String name = "";
        private String description = "";
        private List<LatLng> pathCoordinates = new ArrayList<>();
        private List<Tag> tags = new ArrayList<>();

        public TripBuilder key(int key) {
            this.key = key;
            return this;
        }

        public TripBuilder name(String name) {
            this.name = name;
            return this;
        }

        public TripBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TripBuilder pathCoordinates(List<LatLng> pathCoordinates) {
            this.pathCoordinates = pathCoordinates;
            return this;
        }

        public TripBuilder tags(List<Tag> tags) {
            this.tags = tags;
            return this;
        }

        public Trip build() {
            return new Trip(
                    key,
                    name,
                    description,
                    pathCoordinates,
                    tags);
        }
    }
}
