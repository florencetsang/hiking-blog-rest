import React, { useState, useEffect, useContext } from 'react';

import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { useAnalytics } from 'reactfire';
import Box from '@mui/material/Box';

import GoogleMapsMap from './google_maps/GoogleMapsMap';
import OpenStreetMapMap from './open_street_map/OpenStreetMap';
import { getTrips } from '../../services/tripApi';
import { getInitialMapType } from '../../utils/map';
import { LoadingContext } from '../context/LoadingContext';
import { MapType } from '../../data/map';

const ZOOM = 11;

const CENTER = {
    lat: 22.302711,
    lng: 114.177216
};

export default function HikingMap() {
    const location = useLocation();
    const analytics = useAnalytics();
    const appLoading = useContext(LoadingContext);

    const [trips, setTrips] = useState([]);

    const mapType = getInitialMapType();

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
        return () => { didCancel = true; };
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

    let mapComp;
    if (mapType === MapType.OPENSTREETMAP) {
        mapComp = (
            <OpenStreetMapMap
                initialCenter={CENTER}
                initialZoom={ZOOM}
                trips={trips} />
        );
    } else {
        mapComp = (
            <GoogleMapsMap
                initialCenter={CENTER}
                initialZoom={ZOOM}
                trips={trips} />
        );
    }

    return (
        <Box sx={{
            width: '100%',
            height: 'calc(100vh - 64px)'
        }}>
            {mapComp}
        </Box>
    );
};
