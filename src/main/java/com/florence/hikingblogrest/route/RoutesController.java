package com.florence.hikingblogrest.route;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;

@RestController
public class RoutesController {

    private static final Logger LOGGER = LogManager.getLogger(RoutesController.class);

    RoutesService routesService;

    public RoutesController(RoutesService routesService) {
        this.routesService = routesService;
    }

    @GetMapping("/get-routes")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"})
    public Routes getRoutes() throws FileNotFoundException {
        return routesService.getRoutes();
    }

    @PostMapping(value = "/create-post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"})
    public ResponseEntity<String> createPost(HttpServletRequest request) throws IOException, ServletException {
      Part filePart = request.getPart("file");
        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
        LOGGER.info("Create post endpoint received {}. Name: {}, File: {}, Description: {}", request, request.getParameter("name"), fileName, request.getParameter("description"));
        InputStream fileContent = filePart.getInputStream();
        return ResponseEntity.ok("Received form data");
    }

}
