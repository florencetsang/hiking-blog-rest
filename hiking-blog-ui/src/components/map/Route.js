import React, { useState } from 'react';
import { Polyline, InfoWindow } from '@react-google-maps/api';

/**
 * @param {{ setActiveKey: (arg0: any) => void; label: {}; isActive: any; strokeOpacity: any; pathCoordinates: any; strokeColor: any; strokeWeight: any; dottedStroke: any; }} props
 */
export default function Route(props) {

    const [infoWindowPosition, setInfoWindowPosition] = useState({
        lat: 22.302711,
        lng: 114.177216
    });

    const handleToggleOpen = (position) => {

        props.setActiveKey(props.label);
        console.log("Setting active key to " + props.label);
        setInfoWindowPosition({
            lat: position.lat(),
            lng: position.lng()
        });
        console.log(`Info box for Route ${props.label} is opened. Lat: ${position.lat()} Lng: ${position.lng()}. Is active: ${props.isActive}`);
    }

    const handleToggleClose = () => {
        props.setActiveKey(null);
        console.log(`Info box for Route ${props.label} is closed.`);
    }

    const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: props.strokeOpacity,
        scale: 4,
    };

    return (
        <div>
            <Polyline
                path={props.pathCoordinates}
                options={{
                    strokeColor: props.strokeColor,
                    strokeWeight: props.strokeWeight,
                    strokeOpacity: props.dottedStroke ? 0 : props.strokeOpacity,
                    icons: [
                        props.dottedStroke ?
                            {
                                icon: lineSymbol,
                                offset: "0",
                                repeat: "20px",
                            }
                            : {}
                    ]
                }}
                onClick={(event) => handleToggleOpen(event.latLng)}
            >
            </Polyline>
            {
                props.isActive &&
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
