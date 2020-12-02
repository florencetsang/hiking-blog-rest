package com.florence.hikingblogrest.route

import java.util.*

class Routes {
    private var routes: MutableList<Route>
    fun getRoutes(): List<Route> {
        return routes
    }

    fun setRoutes(routes: MutableList<Route>) {
        this.routes = routes
    }

    fun addRoute(route: Route) {
        routes.add(route)
    }

    fun clearRoutes() {
        routes.clear()
    }

    init {
        routes = ArrayList()
    }
}