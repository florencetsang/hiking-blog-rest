import React, { useState, useEffect } from 'react';
import Routes from './Routes';
import { GoogleMap, LoadScript } from '@react-google-maps/api'
import ReactDOM from 'react-dom';
import ControlPanel from './ControlPanel'

const zoom = 11;

const center = {
    lat: 22.302711,
    lng: 114.177216
};

const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 48px)'
};

export default function HikingMap() {

    const [routes, setRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        fetch('http://localhost:8080/get-routes')
            .then(response => response.json())
            .then(data => {
                if (isMounted) {
                    setRoutes(data.routes);
                    setIsLoading(false);
                    console.log(`Number of routes fetched: ${data.routes.length}`);
                    data.routes.map(route => console.log(`Fetched ${route.key}`))
                }
            });
        return () => {
            isMounted = false;
        };
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
            googleMapsApiKey="AIzaSyDAkQIEvrwQHfvmPLuTjGo9hzO0HDVgAJc"
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={zoom}
                center={center}
                clickableIcons={false}
                options={{
                    streetViewControl: false,
                    gestureHandling: "greedy",
                    mapTypeId: "terrain",
                    mapTypeControlOptions: { position: 3 },
                }}
            // onLoad={map => handleOnLoad(map)}
            >
                <Routes routes={routes}
                // strokeColor={strokeColor}
                // strokeWeight={strokeWeight}
                // strokeOpacity={strokeOpacity}
                // dottedStroke={dottedStroke}
                ></Routes>
                {/* <ControlPanelElement /> */}
            </GoogleMap>

        </LoadScript>
    )
};