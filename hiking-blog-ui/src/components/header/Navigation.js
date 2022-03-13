import React, { useState, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import {
    Link,
    matchPath,
    useLocation,
  } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,

    },
}));

export default function Navigation(props) {
    const classes = useStyles();
    const [value, setValue] = useState("map");
    const handleChange = useCallback((event, newValue) => {
        setValue(newValue);
    }, [setValue]);


    return (
        <div className={classes.root}>
            <Paper className={classes.root}>
                <Tabs 
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered                
                >
                    <Tab label="Map" value="map" to="/map" component={Link}  />
                    <Tab label="Routes" value="routes" to="/routes" component={Link} />
                    <Tab label="New Route" value="new-post" to="/new-post" component={Link} />
                </Tabs>
            </Paper>
        </div>
    );
}
