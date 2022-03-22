import React, { useState } from 'react';
import Route from './Route';
import ControlPanel from './ControlPanel';
import * as mapStyle from './MapStyle';

export default function Routes(props) {
    const {trips} = props;

    const [activeKey, setActiveKey] = useState(null);
    const [strokeColor, setStrokeColor] = useState('#0000FF');
    const [strokeWeight, setStrokeWeight] = useState(4);
    const [strokeOpacity, setStrokeOpacity] = useState(0.7);
    const [strokeStyle, setStrokeStyle] = useState(mapStyle.SOLID);

    console.log(`Dashed stroke in Routes is ${strokeStyle}`);
    console.log(`Number to routes to render: ${trips.length}`);

    return (
        <div>
            <ControlPanel
                setStrokeColor={setStrokeColor}
                setStrokeWeight={setStrokeWeight}
                setStrokeOpacity={setStrokeOpacity}
                setStrokeStyle={setStrokeStyle}
                strokeColor={strokeColor}
                strokeWeight={strokeWeight}
                strokeOpacity={strokeOpacity}
                strokeStyle={strokeStyle}
                position={window.google.maps.ControlPosition.TOP_CENTER}
            />

            {trips && trips.map(trip => <Route
                key={trip.key}
                tripKey={trip.key}
                name={trip.name}
                setActiveKey={setActiveKey}
                isActive={trip.key === activeKey}
                pathCoordinates={trip.pathCoordinates}
                strokeColor={strokeColor}
                strokeWeight={strokeWeight}
                strokeOpacity={strokeOpacity}
                strokeStyle={strokeStyle} />)}
        </div>
    );
};
