import React from 'react';
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

    function useRouteMatch(patterns) {
        const { pathname } = useLocation();
        for(const pattern of patterns){
            const possibleMatch = matchPath(pattern, pathname);
            if (possibleMatch !== null) {
              return possibleMatch;
            }
        }      
        return null;
      }

    const routeMatch = useRouteMatch(['/map', '/routes', '/new-post']);
    const currentTab = routeMatch?.pattern?.path;

    return (
        <div className={classes.root}>
            <Paper className={classes.root}>
                <Tabs 
                    value={currentTab}
                    indicatorColor="primary"
                    textColor="primary"
                    centered                
                >
                    <Tab label="Map" value="/map" to="/map" component={Link}  />
                    <Tab label="Routes" value="/routes" to="/routes" component={Link} />
                    <Tab label="New Route" value="/new-post" to="/new-post" component={Link} />
                </Tabs>
            </Paper>
        </div>
    );
}
