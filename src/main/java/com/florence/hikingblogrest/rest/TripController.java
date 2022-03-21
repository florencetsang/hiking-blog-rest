package com.florence.hikingblogrest.rest;

import com.florence.hikingblogrest.dto.Trip;
import com.florence.hikingblogrest.rest.response.ApiRes;
import com.florence.hikingblogrest.rest.response.FailApiRes;
import com.florence.hikingblogrest.rest.response.SuccessApiRes;
import com.florence.hikingblogrest.security.UserPrincipal;
import com.florence.hikingblogrest.service.TripService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/trip")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"})
public class TripController {
    private static final Logger LOGGER = LogManager.getLogger(TripController.class);

    private static final ApiRes CANNOT_GET_RES = new FailApiRes("cannot get trip");
    private static final ApiRes CANNOT_CREATE_RES = new FailApiRes("cannot create trip");
    private static final ApiRes CANNOT_DELETE_RES = new FailApiRes("cannot delete trip");

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping("/getTrips")
    public ApiRes getTrips(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        final String uid = userPrincipal.getUid();
        LOGGER.info("Get trips. UID: {}", uid);
        final List<Trip> activities = tripService.getTrips(uid);
        return new SuccessApiRes<>(activities);
    }

    @GetMapping(value = "/getTrip", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiRes getTrip(
            @RequestParam int tripId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        final String uid = userPrincipal.getUid();
        LOGGER.info("Get trip. UID: {}, tripId: {}", uid, tripId);
        final Trip trip = tripService.getTrip(uid, tripId);
        if (trip == null) {
            LOGGER.info("cannot get trip {}", tripId);
            return CANNOT_GET_RES;
        }
        LOGGER.info("Get trip {}", tripId);
        return new SuccessApiRes<>(trip);
    }

    @PostMapping(value = "/createTrip", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiRes createTrip(
            @RequestPart(name = "trip") CreateTripReqBody createTripReqBody,
            @RequestPart(name = "routeFile") MultipartFile routeFile,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        final String uid = userPrincipal.getUid();
        final InputStream routeFileInputStream;
        try {
            routeFileInputStream = routeFile.getInputStream();
        } catch (IOException e) {
            LOGGER.error("cannot get routeFile input stream");
            return CANNOT_CREATE_RES;
        }
        LOGGER.info("Create trip. UID: {}, tripReqBody: {}, routeFile: {}", uid, createTripReqBody, routeFile.getName());
        final int addedId = tripService.addTrip(
                createTripReqBody.getName(),
                createTripReqBody.getDescription(),
                routeFileInputStream,
                createTripReqBody.getTagIds(),
                uid);
        if (addedId < 0) {
            LOGGER.error("cannot create trip, addedId: {}", addedId);
            return CANNOT_CREATE_RES;
        }
        LOGGER.info("Created trip {}", addedId);
        return new SuccessApiRes<>(addedId);
    }

    @PostMapping(value = "/deleteTrip", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiRes deleteTrip(
            @RequestBody DeleteTripReqBody request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        final int tripId = request.getTripId();
        final String uid = userPrincipal.getUid();
        LOGGER.info("Delete trip. UID: {}, tripId: {}", uid, tripId);
        final int deletedId = tripService.deleteTrip(uid, tripId);
        if (deletedId < 0) {
            LOGGER.error("cannot delete trip {}", tripId);
            return CANNOT_DELETE_RES;
        }
        LOGGER.info("Deleted trip {}", deletedId);
        return new SuccessApiRes<>(deletedId);
    }

    public abstract static class TripReqBody {
        private String name;
        private String description;
        private List<Integer> tagIds = new ArrayList<>();

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        public List<Integer> getTagIds() {
            return tagIds;
        }

        @Override
        public String toString() {
            return "name: "
                    + name
                    + ", description: "
                    + description
                    + ", tags: "
                    + tagIds.size();
        }
    }

    public static class CreateTripReqBody extends TripReqBody {

    }

    public static class DeleteTripReqBody {
        private int tripId;

        public int getTripId() {
            return tripId;
        }

        @Override
        public String toString() {
            return "tripId: " + tripId;
        }
    }
}
