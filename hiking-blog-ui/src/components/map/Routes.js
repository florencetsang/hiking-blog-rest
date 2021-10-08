import React, { useState } from 'react';
import Route from './Route';
import ControlPanel from './ControlPanel';

export default function Routes(props) {

    const [activeKey, setActiveKey] = useState(null);
    const [strokeColor, setStrokeColor] = useState('#0000FF');
    const [strokeWeight, setStrokeWeight] = useState(4);
    const [strokeOpacity, setStrokeOpacity] = useState(0.7);
    const [dottedStroke, setDottedStroke] = useState(false);

    console.log(`Dotted stroke in Routes is ${dottedStroke}`);
    console.log(`Number to routes to render: ${props.routes.length}`);

    return (
        <div>
            <ControlPanel
                setStrokeColor={setStrokeColor}
                setStrokeWeight={setStrokeWeight}
                setStrokeOpacity={setStrokeOpacity}
                setDottedStroke={setDottedStroke}
                strokeColor={strokeColor}
                strokeWeight={strokeWeight}
                strokeOpacity={strokeOpacity}
                dottedStroke={dottedStroke}
                position={window.google.maps.ControlPosition.TOP_CENTER}

            ></ControlPanel>

            {props.routes.map(route => <Route
                key={route.key}
                label={route.key}
                setActiveKey={setActiveKey}
                isActive={route.key === activeKey}
                pathCoordinates={route.pathCoordinates}
                strokeColor={strokeColor}
                strokeWeight={strokeWeight}
                strokeOpacity={strokeOpacity}
                dottedStroke={dottedStroke}></Route>)}
        </div>
    );

};