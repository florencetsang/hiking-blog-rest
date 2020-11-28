package com.florence.hikingblogrest;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jdom2.*;
import org.jdom2.input.SAXBuilder;


public class Route {

    private List<LatLng> pathCoordinates;

    public List<LatLng> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<LatLng> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }

    public Route() {
        this.pathCoordinates = loadGpxData();
    }

    private List<LatLng> loadGpxData() {

        List<LatLng> latLngs = new ArrayList();
        ClassLoader classLoader = getClass().getClassLoader();
        //classLoader.getResource("393231.gpx").getFile())
        //"classpath:393231.gpx"
        Namespace ns = Namespace.getNamespace("", "http://www.topografix.com/GPX/1/1");
        try {

            File inputFile = new File(classLoader.getResource("393231.gpx").getFile());
            SAXBuilder saxBuilder = new SAXBuilder();
            Document document = saxBuilder.build(inputFile);

            Element classElement = document.getRootElement();
            System.out.println("Root element :" + classElement.getName());

            for (Element element : classElement.getChildren()) {
                System.out.println("Level 1 element :" + element.getName());
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
                        Double.valueOf(lat.getValue()),
                        Double.valueOf(lon.getValue())));

            }

        } catch (JDOMException e) {
            e.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }

        return latLngs;

    }


}
