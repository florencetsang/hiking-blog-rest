import React, { useState, useCallback } from 'react';

import { Polyline, InfoWindow } from '@react-google-maps/api';

import { Link } from 'react-router-dom';

import { getTripDetailsUrl } from '../../header/navUtil';

import { StrokeStyle } from './data';

export default function Route(props) {
    const [infoWindowPosition, setInfoWindowPosition] = useState({
        lat: 22.302711,
        lng: 114.177216
    });

    const {tripKey, name, setActiveKey, isActive, strokeOpacity, pathCoordinates, strokeColor, strokeWeight, strokeStyle} = props;

    const handleToogleOpen = useCallback((event) => {
        const position = event.latLng;
        setActiveKey(tripKey);
        console.log("Setting active key to " + tripKey);
        setInfoWindowPosition({
            lat: position.lat(),
            lng: position.lng()
        });
        console.log(`Info box for Route ${tripKey} is opened. Lat: ${position.lat()} Lng: ${position.lng()}. Is active: ${isActive}`);
    }, [setActiveKey, setInfoWindowPosition]);

    const handleToggleClose = useCallback(() => {
        setActiveKey(null);
        console.log(`Info box for Route ${tripKey} is closed.`);
    }, [setActiveKey]);

    const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: strokeOpacity,
        scale: 4,
    };

    const icons = [
        strokeStyle == StrokeStyle.DASHED ?
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
                    strokeOpacity: strokeStyle == StrokeStyle.DASHED ? 0 : strokeOpacity,
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
                    <div>
                        <Link to={getTripDetailsUrl(tripKey)}>{name}</Link>
                    </div>
                </InfoWindow>
            }
        </div >
    );
};
