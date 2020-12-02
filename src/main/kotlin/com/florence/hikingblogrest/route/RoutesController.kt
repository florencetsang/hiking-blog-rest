package com.florence.hikingblogrest.route

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class RoutesController(var routesService: RoutesService) {
    @get:CrossOrigin(origins = ["http://localhost:3000"])
    @get:GetMapping("/get-routes")
    val routes: Routes?
        get() {
            routesService.fetchRoutes()
            return routesService.routes
        }
}