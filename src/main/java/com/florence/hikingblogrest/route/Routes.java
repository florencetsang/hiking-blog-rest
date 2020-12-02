package com.florence.hikingblogrest.route;

import java.util.ArrayList;
import java.util.List;

public class Routes {

    private List<Route> routes;

    public Routes() {
        this.routes = new ArrayList<>();
    }

    public List<Route> getRoutes() {
        return routes;
    }

    public void setRoutes(List<Route> routes) {
        this.routes = routes;
    }

    public void addRoute(Route route) {
        this.routes.add(route);
    }

    public void clearRoutes(){
        this.routes.clear();
    }
}
