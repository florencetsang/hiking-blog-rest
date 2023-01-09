import React, { useState, useEffect, useContext } from 'react';

import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { useAnalytics } from 'reactfire';

import Routes from './Routes';
import { GoogleMap, LoadScript } from '@react-google-maps/api'

import { getTrips } from '../../services/tripApi';
import { LoadingContext } from '../context/LoadingContext';

import {GOOGLE_MAPS_API_KEY} from './utils';

const ZOOM = 11;

const CENTER = {
    lat: 22.302711,
    lng: 114.177216
};

const CONTAINER_STYLE = {
    width: '100%',
    height: 'calc(100vh - 48px)'
};

const GOOGLE_MAP_OPTIONS = {
    streetViewControl: false,
    gestureHandling: "greedy",
    mapTypeId: "terrain",
    mapTypeControlOptions: { position: 3 },
}

export default function HikingMap() {
    const location = useLocation();
    const analytics = useAnalytics();
    const appLoading = useContext(LoadingContext);

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        let didCancel = false;
        const loadingId = appLoading.load();
        const _loadTrips = async () => {
            const trips = await getTrips();
            appLoading.unLoad(loadingId);
            if (!didCancel) {
                setTrips(trips);
                console.log(`Number of trips fetched: ${trips.length}`);
                trips.map(trip => console.log(`Fetched ${trip.key}`))
            }
        };
        _loadTrips();
        return () => {
            didCancel = true;
            appLoading.unLoad(loadingId);
        };
    }, []);

    useEffect(() => {
        logEvent(analytics, 'page_view', { page_location: location.pathname });
    });

    // const [strokeColor, setStrokeColor] = useState('#0000FF');
    // const [strokeWeight, setStrokeWeight] = useState(4);
    // const [strokeOpacity, setStrokeOpacity] = useState(0.7);
    // const [dottedStroke, setDottedStroke] = useState(false);

    // const ControlPanelElement = () => (<ControlPanel
    //     setStrokeColor={setStrokeColor}
    //     setStrokeWeight={setStrokeWeight}
    //     setStrokeOpacity={setStrokeOpacity}
    //     setDottedStroke={setDottedStroke}
    //     strokeColor={strokeColor}
    //     strokeWeight={strokeWeight}
    //     strokeOpacity={strokeOpacity}
    //     dottedStroke={dottedStroke}
    // />);

    // const handleOnLoad = map => {
    //     // const controlButtonDiv = document.createElement('div');
    //     // ReactDOM.render(<ControlPanel
    //     //     setStrokeColor={setStrokeColor}
    //     //     setStrokeWeight={setStrokeWeight}
    //     //     setStrokeOpacity={setStrokeOpacity}
    //     //     setDottedStroke={setDottedStroke}
    //     //     strokeColor={strokeColor}
    //     //     strokeWeight={strokeWeight}
    //     //     strokeOpacity={strokeOpacity}
    //     //     dottedStroke={dottedStroke}
    //     //     position={window.google.maps.ControlPosition.TOP_CENTER} />, controlButtonDiv);
    //     map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(ControlPanelElement());
    // };

    return (
        <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        >
            <GoogleMap
                mapContainerStyle={CONTAINER_STYLE}
                zoom={ZOOM}
                center={CENTER}
                clickableIcons={false}
                options={GOOGLE_MAP_OPTIONS}
            // onLoad={map => handleOnLoad(map)}
            >
                <Routes trips={trips} />
                {/* <ControlPanelElement /> */}
            </GoogleMap>

        </LoadScript>
    )
};
