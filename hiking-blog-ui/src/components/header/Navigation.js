import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Navigation(props) {
    const classes = useStyles();
    const [value, setValue] = useState("map");

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue);
        props.setActiveTab(newValue);
    }, [setValue, props.setActiveTab]);

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
                    <Tab label="Map" value="map" />
                    <Tab label="Routes" value="routes" />
                    <Tab label="New Route" value="form-material" />
                </Tabs>
            </Paper>
        </div>
    );
}
