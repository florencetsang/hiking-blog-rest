package com.florence.hikingblogrest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RouteController {

    @GetMapping("/getRoutes")
    public Routes getRoutes() {
        return new Routes();
    }
}
