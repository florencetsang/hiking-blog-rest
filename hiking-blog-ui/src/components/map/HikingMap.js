import React, { useState, useEffect } from 'react';
import Routes from './Routes';
import { GoogleMap, LoadScript } from '@react-google-maps/api'
import { getApi } from '../../services/api';

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

    const [routes, setRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRoutes = async () => {
        getApi('/api/get-routes')
        .then(response => response.json())
        .then(data => {
            setRoutes(data.routes);
            setIsLoading(false);
            console.log(`Number of routes fetched: ${data.routes.length}`);
            data.routes.map(route => console.log(`Fetched ${route.key}`))                
        })
        .catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        loadRoutes();        
    }, []);

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

    if (isLoading) {
        return <p> Loading... </p>;
    }

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
            <GoogleMap
                mapContainerStyle={CONTAINER_STYLE}
                zoom={ZOOM}
                center={CENTER}
                clickableIcons={false}
                options={GOOGLE_MAP_OPTIONS}
            // onLoad={map => handleOnLoad(map)}
            >
                <Routes routes={routes} />
                {/* <ControlPanelElement /> */}
            </GoogleMap>

        </LoadScript>
    )
};
