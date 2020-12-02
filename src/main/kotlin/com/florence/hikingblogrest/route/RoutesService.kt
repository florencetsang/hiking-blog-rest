package com.florence.hikingblogrest.route

import com.florence.hikingblogrest.proxy.CloudStorageProxy
import org.apache.logging.log4j.LogManager
import org.jdom2.JDOMException
import org.jdom2.Namespace
import org.jdom2.input.SAXBuilder
import java.io.IOException
import java.io.InputStream
import java.util.*
import javax.xml.XMLConstants

class RoutesService(var cloudStorageProxy: CloudStorageProxy) {
    fun fetchRoutes() {
        Companion.routes.clearRoutes()
        val routeFiles = cloudStorageProxy.allGpxRoutes
        for ((key, value) in routeFiles!!) {
            Companion.routes.addRoute(Route(key, loadGpxData(value)))
            LOGGER.info("Loaded {}", key)
        }
    }

    val routes: Routes
        get() = Companion.routes

    companion object {
        private val LOGGER = LogManager.getLogger(RoutesService::class.java)
        private val routes = Routes()
        private fun loadGpxData(gpxFile: InputStream): List<LatLng> {
            val latLngs: MutableList<LatLng> = ArrayList()
            val ns = Namespace.getNamespace("", "http://www.topografix.com/GPX/1/1")
            try {
                val saxBuilder = SAXBuilder()
                saxBuilder.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "")
                saxBuilder.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "")
                val document = saxBuilder.build(gpxFile)
                val classElement = document.rootElement
                LOGGER.debug("Root element :{}", classElement.name)
                for (element in classElement.children) {
                    LOGGER.debug("Level 1 elements :{}", element.name)
                }
                val track = classElement.getChild("trk", ns)
                LOGGER.debug("Trk: {}", track.name)
                val trackSegment = track.getChild("trkseg", ns)
                val trackPoints = trackSegment.getChildren("trkpt", ns)
                LOGGER.debug("----------------------------")
                for (trackPoint in trackPoints) {
                    LOGGER.debug("\nCurrent Element :{}", trackSegment.name)
                    val lat = trackPoint.getAttribute("lat")
                    val lon = trackPoint.getAttribute("lon")
                    LOGGER.debug("lat: {}, lon: {}", lat.value, lon.value)
                    latLngs.add(LatLng(lat.value.toDouble(), lon.value.toDouble()))
                }
            } catch (e: JDOMException) {
                e.printStackTrace()
            } catch (e: IOException) {
                e.printStackTrace()
            }
            return latLngs
        }
    }
}