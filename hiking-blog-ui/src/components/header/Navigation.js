import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Navigation(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState("map");

    const handleChange = (event, newValue) => {
        setValue(newValue);
        props.setActiveTab(newValue);
    };

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
