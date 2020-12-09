package com.florence.hikingblogrest.route;

import com.florence.hikingblogrest.proxy.CloudStorageProxy;
import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jdom2.*;
import org.jdom2.input.SAXBuilder;
import org.springframework.lang.Nullable;

import javax.xml.XMLConstants;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RoutesService {

    private static final Logger LOGGER = LogManager.getLogger(RoutesService.class);

    CloudStorageProxy cloudStorageProxy;
    String localFolderOverride;

    public RoutesService(CloudStorageProxy cloudStorageProxy, @Nullable String localFolderOverride) {
        this.cloudStorageProxy = cloudStorageProxy;
        this.localFolderOverride = localFolderOverride;
    }

    public Routes getRoutes() throws FileNotFoundException {
        Map<String, InputStream> routeFiles = fetchRoutesFiles(localFolderOverride);
        Routes routes = new Routes();
        for (Map.Entry<String, InputStream> routeFile : routeFiles.entrySet()) {
            routes.addRoute(new Route(routeFile.getKey(), loadGpxData(routeFile.getValue())));
            LOGGER.info("Loaded {}", routeFile.getKey());
        }
        return routes;
    }

    private Map<String, InputStream> fetchRoutesFiles(@Nullable String localFolderOverride) throws FileNotFoundException {
        if (localFolderOverride == null) {
            LOGGER.info("Local folder override is null. Getting routes from cloud storage.");
            return cloudStorageProxy.getAllGpxRoutes();
        } else {
            LOGGER.info("Local folder override is {}. Fetching route files.", localFolderOverride);
            Map<String, InputStream> routeFiles = new HashMap<>();
            File folder = new File(localFolderOverride);
            File[] files = folder.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        routeFiles.put(FilenameUtils.getBaseName(file.getName()), new FileInputStream(file));
                        LOGGER.info("Loaded route file {}", file.getName());
                    }
                }
            }
            return routeFiles;
        }
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
