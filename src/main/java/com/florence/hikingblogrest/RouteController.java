package com.florence.hikingblogrest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RouteController {

    @GetMapping("/get-routes")
    @CrossOrigin(origins="http://localhost:3000")
    public Routes getRoutes() {
        return new Routes();
    }
}
