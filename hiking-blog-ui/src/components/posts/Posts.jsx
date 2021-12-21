import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ActivityCard from './ActivityCard';
import { Grid } from '@material-ui/core/';
import { getAuth } from "firebase/auth";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
        height: '100%'
    }
}))

export default function Posts() {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const auth = getAuth();

    const loadRoutes = async () => {

        setIsLoading(true);

        const getAuthToken = async () => {
            try {
                return await auth.currentUser?.getIdToken(false);
            } catch (e) {
                console.log(e);
                return null;
            }
        }
        const authToken = await getAuthToken();
        if (!authToken) {
            console.log('auth token is null');
            return;
        }
        
        console.log(`Fetching activities with auth token: ${authToken}`);
        fetch(`/get-activities?authToken=${authToken}`)
            .then(response => response.json())
            .then(data => {
                setActivities(data);
                setIsLoading(false);
                console.log(`Number of activities fetched: ${data.length}`);
                console.log(`Activities: ${data}`);
                data.map(activity => console.log(`Fetched activity with ID: ${activity.key}`))
            });
    }

    useEffect(() => {
        loadRoutes();
    }, [auth]);

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
                        <ActivityCard key={activity.key} id={activity.key} title={activity.name} description={activity.description} pathCoordinates={activity.pathCoordinates} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};
