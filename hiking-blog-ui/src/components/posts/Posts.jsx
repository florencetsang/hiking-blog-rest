import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import ActivityCard from './ActivityCard';
import { getApi } from '../../services/api';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: 2,
        margin: '2em',
        height: '100%'
    }
}))

export default function Posts() {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [activities, setActivities] = useState([]);

    const loadRoutes = async () => {

        setIsLoading(true);
        
        console.log("Fetching activities.");
        getApi("/api/get-activities")
        .then(response => response.json())
        .then(data => {
            setActivities(data);
            setIsLoading(false);
            console.log(`Number of activities fetched: ${data.length}`);
            console.log(`Activities: ${data}`);
            data.map(activity => console.log(`Fetched activity with ID: ${activity.key}`))
        });
    }

    const deleteActivity = (id) => {
        setActivities(activities.filter(activity => activity.key !== id));     
    }

    useEffect(() => {
        loadRoutes();
    }, []);

    if (isLoading) {
        return <p> Loading... </p>;
    }

    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {activities.map(activity => (
                    <Grid item xs={12} sm={6} md={3} key={activity.key}>
                        <ActivityCard key={activity.key} id={activity.key} title={activity.name} description={activity.description} pathCoordinates={activity.pathCoordinates} deleteActivity={deleteActivity} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};
