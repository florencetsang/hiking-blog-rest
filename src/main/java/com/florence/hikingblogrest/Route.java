package com.florence.hikingblogrest;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jdom2.Attribute;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
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

        try {

            File inputFile = new File("/main/resources/393231.gpx");
            SAXBuilder saxBuilder = new SAXBuilder();
            Document document = saxBuilder.build(inputFile);

            Element classElement = document.getRootElement();
            System.out.println("Root element :" + classElement.getName());

            for (Element element : classElement.getChildren()) {
                System.out.println("Level 1 element :" + element.getName());
            }

            Element track = classElement.getChild("trk");
            System.out.println("Trk:" + track.getName());
            List<Element> trackSegments = track.getChildren("trkseg");

            System.out.println("----------------------------");

            for (Element trackSegment : trackSegments) {
                System.out.println("\nCurrent Element :" + trackSegment.getName());
                Attribute lat = trackSegment.getAttribute("lat");
                Attribute lon = trackSegment.getAttribute("lon");
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
