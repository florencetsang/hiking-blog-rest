package com.florence.hikingblogrest.route;

import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jdom2.*;
import org.jdom2.input.SAXBuilder;

import javax.xml.XMLConstants;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RoutesService {

    private static final Logger LOGGER = LogManager.getLogger(RoutesService.class);

    CloudStorageProxy cloudStorageProxy;
    private static final Routes routes = new Routes();

    public RoutesService(CloudStorageProxy cloudStorageProxy) {
        this.cloudStorageProxy = cloudStorageProxy;
    }

    public void fetchRoutes() {
        routes.clearRoutes();
        Map<String, InputStream> routeFiles = cloudStorageProxy.getAllGpxRoutes();
        for (Map.Entry<String, InputStream> routeFile : routeFiles.entrySet()) {
            routes.addRoute(new Route(routeFile.getKey(), loadGpxData(routeFile.getValue())));
            LOGGER.info("Loaded {}", routeFile.getKey());
        }
    }

    public Routes getRoutes() {
        return routes;
    }

    private static List<LatLng> loadGpxData(InputStream gpxFile) {

        List<LatLng> latLngs = new ArrayList<>();
        Namespace ns = Namespace.getNamespace("", "http://www.topografix.com/GPX/1/1");

        try {

            SAXBuilder saxBuilder = new SAXBuilder();
            saxBuilder.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
            saxBuilder.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
            Document document = saxBuilder.build(gpxFile);

            Element classElement = document.getRootElement();
            LOGGER.debug("Root element :{}", classElement.getName());

            for (Element element : classElement.getChildren()) {
                LOGGER.debug("Level 1 elements :{}", element.getName());
            }

            Element track = classElement.getChild("trk", ns);
            LOGGER.debug("Trk: {}", track.getName());
            Element trackSegment = track.getChild("trkseg", ns);
            List<Element> trackPoints = trackSegment.getChildren("trkpt", ns);

            LOGGER.debug("----------------------------");

            for (Element trackPoint : trackPoints) {
                LOGGER.debug("\nCurrent Element :{}", trackSegment.getName());
                Attribute lat = trackPoint.getAttribute("lat");
                Attribute lon = trackPoint.getAttribute("lon");
                LOGGER.debug("lat: {}, lon: {}", lat.getValue(), lon.getValue());

                latLngs.add(new LatLng(
                        Double.parseDouble(lat.getValue()),
                        Double.parseDouble(lon.getValue())));
            }

        } catch (JDOMException | IOException e) {
            e.printStackTrace();
        }

        return latLngs;
    }

}
