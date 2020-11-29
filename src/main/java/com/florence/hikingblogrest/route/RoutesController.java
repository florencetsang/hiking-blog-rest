package com.florence.hikingblogrest.route;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoutesController {

    RoutesService routesService;

    public RoutesController(RoutesService routesService){
        this.routesService = routesService;
    }

    @GetMapping("/get-routes")
    @CrossOrigin(origins = "http://localhost:3000")
    public Routes getRoutes() {
        return routesService.getRoutes();
    }
}
