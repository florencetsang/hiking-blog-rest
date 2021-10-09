import React, { useState, useCallback } from 'react';
import { Polyline, InfoWindow } from '@react-google-maps/api';

const DASHED = "dashed";

/**
 * @param {{ setActiveKey: (arg0: any) => void; label: {}; isActive: any; strokeOpacity: any; pathCoordinates: any; strokeColor: any; strokeWeight: any; strokeStyle: any; }} props
 */
export default function Route(props) {

    const [infoWindowPosition, setInfoWindowPosition] = useState({
        lat: 22.302711,
        lng: 114.177216
    });

    const {setActiveKey, isActive, strokeOpacity, pathCoordinates, strokeColor, strokeWeight, strokeStyle} = props;

    const handleToogleOpen = useCallback((event) => {
        const position = event.latLng;
        setActiveKey(props.label);
        console.log("Setting active key to " + props.label);
        setInfoWindowPosition({
            lat: position.lat(),
            lng: position.lng()
        });
        console.log(`Info box for Route ${props.label} is opened. Lat: ${position.lat()} Lng: ${position.lng()}. Is active: ${isActive}`);
    }, [setActiveKey, setInfoWindowPosition]);

    const handleToggleClose = useCallback(() => {
        setActiveKey(null);
        console.log(`Info box for Route ${props.label} is closed.`);
    }, [setActiveKey]);

    const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: strokeOpacity,
        scale: 4,
    };

    const icons = [
        strokeStyle == DASHED ?
            {
                icon: lineSymbol,
                offset: "0",
                repeat: "20px",
            }
            : {}
    ];

    return (
        <div>
            <Polyline
                path={pathCoordinates}
                options={{
                    strokeColor: strokeColor,
                    strokeWeight: strokeWeight,
                    strokeOpacity: strokeStyle == DASHED ? 0 : strokeOpacity,
                    icons: icons
                }}
                onClick={handleToogleOpen}
            >
            </Polyline>
            {
                isActive &&
                <InfoWindow
                    onCloseClick={handleToggleClose}
                    position={infoWindowPosition}
                >
                    <span>I am an InfoWindow for Route {props.label}.</span>
                </InfoWindow>
            }
        </div >
    );
};
