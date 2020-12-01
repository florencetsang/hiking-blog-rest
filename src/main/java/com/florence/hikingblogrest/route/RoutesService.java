package com.florence.hikingblogrest.route;

import org.apache.commons.io.FilenameUtils;
import org.jdom2.*;
import org.jdom2.input.SAXBuilder;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class RoutesService {

    private static final Routes routes = new Routes();

    static {

        URL routesFolder = RoutesService.class.getResource("/routes/");
        if (routesFolder != null) {
            File folder = new File(routesFolder.getFile());
            File[] files = folder.listFiles();
            //TODO: files might be NULL when running from jar
            for (File file : files) {
                if (file.isFile()) {
                    routes.addRoute(new Route(loadGpxData(file), FilenameUtils.getBaseName(file.getName())));
                    System.out.println(file.getName());
                }
            }
        }
    }

    public Routes getRoutes() {
        return routes;
    }

    static private List<LatLng> loadGpxData(File gpxFile) {

        List<LatLng> latLngs = new ArrayList();
        Namespace ns = Namespace.getNamespace("", "http://www.topografix.com/GPX/1/1");

        try {

            SAXBuilder saxBuilder = new SAXBuilder();
            Document document = saxBuilder.build(gpxFile);

            Element classElement = document.getRootElement();
            System.out.println("Root element :" + classElement.getName());

            for (Element element : classElement.getChildren()) {
                System.out.println("Level 1 elements :" + element.getName());
            }

            Element track = classElement.getChild("trk", ns);
            System.out.println("Trk:" + track.getName());
            Element trackSegment = track.getChild("trkseg", ns);
            List<Element> trackPoints = trackSegment.getChildren("trkpt", ns);

            System.out.println("----------------------------");

            for (Element trackPoint : trackPoints) {
                System.out.println("\nCurrent Element :" + trackSegment.getName());
                Attribute lat = trackPoint.getAttribute("lat");
                Attribute lon = trackPoint.getAttribute("lon");
                System.out.println("lat : " + lat.getValue() + ",  lon: " + lon.getValue());

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
