package com.florence.hikingblogrest.rest;

import com.florence.hikingblogrest.dto.Activity;
import com.florence.hikingblogrest.dto.Routes;
import com.florence.hikingblogrest.security.UserPrincipal;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.FileNotFoundException;
import java.nio.file.Paths;
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
    public Routes getRoutes(@AuthenticationPrincipal UserPrincipal userPrincipal) throws FileNotFoundException {
        return routesService.getRoutes();
    }

    @GetMapping("/get-activities")
    public List<Activity> getActivities(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return routesService.getActivities(userPrincipal.getUid());
    }

    @PostMapping(value = "/create-post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createPost(HttpServletRequest request, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        LOGGER.info("Create post endpoint hit");
        try {
            final String name = request.getParameter("name");
            final String description = request.getParameter("description");
            final Part filePart = request.getPart("file");
            final String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
            final String uid = userPrincipal.getUid();
            LOGGER.info("Create post endpoint received {}. Uid:{}, Name: {}, File: {}, Description: {}", request, uid, name, fileName, description);
            routesService.createPost(name, description, filePart, uid);
            return ResponseEntity.ok("Received form data");
        } catch (Exception e) {
            LOGGER.error("Exception thrown when processing request {}", request, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/delete-post")
    public ResponseEntity<String> deletePost(@RequestBody DeletePostRequest request, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        final int id = request.getId();
        final String uid = userPrincipal.getUid();
        LOGGER.info("Received delete post request. User: [{}], Id: [{}]", uid, id);
        try {
            routesService.deletePost(uid, id);
            return ResponseEntity.ok("Deleted post with id " + id);
        } catch (Exception e) {
            LOGGER.error("Exception thrown when processing delete post request for id {}.", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
