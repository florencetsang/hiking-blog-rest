package com.florence.hikingblogrest.rest;

import com.florence.hikingblogrest.dto.Activity;
import com.florence.hikingblogrest.dto.Routes;
import com.google.firebase.auth.FirebaseAuthException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.FileNotFoundException;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"})
public class RoutesController {

    private static final Logger LOGGER = LogManager.getLogger(RoutesController.class);

    private final RoutesService routesService;

    public RoutesController(RoutesService routesService) {
        this.routesService = routesService;
    }

    @GetMapping("/get-routes")
    public Routes getRoutes() throws FileNotFoundException {
        return routesService.getRoutes();
    }

    @GetMapping("/get-activities")
    public List<Activity> getActivities(@RequestParam String authToken) throws FirebaseAuthException {
        return routesService.getActivities(authToken);
    }

    @PostMapping(value = "/create-post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createPost(HttpServletRequest request) {
        try {
            routesService.createPost(request);
            return ResponseEntity.ok("Received form data");
        } catch (Exception e) {
            LOGGER.error("Exception thrown when processing request {}", request, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/delete-post")
    public ResponseEntity<String> deletePost(@RequestParam("id") int id) {
        try {
            routesService.deletePost(id);
            return ResponseEntity.ok("Deleted post with id " + id);
        } catch (Exception e) {
            LOGGER.error("Exception thrown when processing delete post request for id {}.", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
