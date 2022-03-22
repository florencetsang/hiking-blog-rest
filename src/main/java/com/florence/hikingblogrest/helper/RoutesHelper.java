package com.florence.hikingblogrest.helper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florence.hikingblogrest.dto.LatLng;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jdom2.*;
import org.jdom2.input.SAXBuilder;

import javax.xml.XMLConstants;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class RoutesHelper {

    private static final Logger LOGGER = LogManager.getLogger(RoutesHelper.class);

    private static final ObjectMapper objectMapper = new ObjectMapper();

    private RoutesHelper() {
        throw new IllegalStateException("Utility class");
    }

    public static List<LatLng> loadGpxData(InputStream gpxFile) {

        Document document = getDocumentFromInputStream(gpxFile);
        if (document == null) return Collections.emptyList();

        Element classElement = document.getRootElement();

        Namespace ns = Namespace.getNamespace("", "http://www.topografix.com/GPX/1/1");

        LOGGER.debug("Root element :{}", classElement.getName());

        for (Element element : classElement.getChildren()) {
            LOGGER.debug("Level 1 elements :{}", element.getName());
        }

        Element track = classElement.getChild("trk", ns);
        LOGGER.debug("Trk: {}", track.getName());
        Element trackSegment = track.getChild("trkseg", ns);
        List<Element> trackPoints = trackSegment.getChildren("trkpt", ns);

        LOGGER.debug("----------------------------");

        return trackPoints.stream().map(trackPoint -> {
            LOGGER.debug("\nCurrent Element :{}", trackSegment.getName());
            Attribute lat = trackPoint.getAttribute("lat");
            Attribute lon = trackPoint.getAttribute("lon");
            LOGGER.debug("lat: {}, lon: {}", lat.getValue(), lon.getValue());

            return new LatLng(
                    Double.parseDouble(lat.getValue()),
                    Double.parseDouble(lon.getValue()));
        }).collect(Collectors.toList());

    }

    public static Optional<String> getRouteStr(InputStream gpxFile) {
        if (gpxFile == null) {
            return Optional.empty();
        }
        final List<LatLng> route = loadGpxData(gpxFile);
        String routeStr = null;
        try {
            routeStr = objectMapper.writeValueAsString(route);
        } catch (JsonProcessingException e) {
            LOGGER.error("Cannot write route as routeStr", e);
        }
        return routeStr != null ? Optional.of(routeStr) : Optional.empty();
    }

    private static Document getDocumentFromInputStream(InputStream inputStream) {

        SAXBuilder saxBuilder = new SAXBuilder();
        saxBuilder.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        saxBuilder.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
        Document document = null;
        try {
            document = saxBuilder.build(inputStream);
        } catch (JDOMException | IOException e) {
            LOGGER.error("Exception thrown when getting document from input stream", e);
        }
        return document;
    }
}
