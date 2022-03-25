import React, { useState, useEffect, useCallback } from 'react';

import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';

import { Link } from 'react-router-dom';

import TripCard from './TripCard';
import TagDetails from '../tag/TagDetails';

import { getTrips } from '../../services/tripApi';
import { getTags } from '../../services/tagApi';
import { NEW_TRIP_URL } from '../header/navUtil';
import { NEW_TRIP_BULK_URL } from './../header/navUtil';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: 2,
        margin: '2em',
        height: '100%'
    }
}));

const tagModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Trips() {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [trips, setTrips] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagModalOpen, setTagModalOpen] = useState(false);

    const deleteTrip = useCallback((tripId) => {
        setTrips(trips => trips.filter(trip => trip.key !== tripId));
    }, [setTrips]);

    useEffect(() => {
        let didCancel = false;
        const _loadTrips = async () => {
            setIsLoading(true);
            console.log("Fetching trips.");
            const trips = await getTrips();
            if (!didCancel) {
                setTrips(trips);
                setIsLoading(false);
                console.log(`Number of trips fetched: ${trips.length}`);
                console.log(`trips: ${trips}`);
                trips.map(trip => console.log(`Fetched trip with ID: ${trip.key}`))
            }
        };
        _loadTrips();
        return () => { didCancel = true; };
    }, []);

    useEffect(() => {
        let didCancel = false;
        const _loadTags = async () => {
            const tags = await getTags();
            if (!didCancel) {
                setTags(tags);
            }
        };
        _loadTags();
        return () => { didCancel = true; };
    }, []);

    const openTagModal = useCallback(() => setTagModalOpen(true), [setTagModalOpen]);
    const closeTagModal = useCallback(() => setTagModalOpen(false), [setTagModalOpen]);

    const postSaveTag = useCallback(() => {
        closeTagModal();
    }, [closeTagModal]);

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
                {trips.map(trip => (
                    <Grid item xs={12} sm={6} md={3} key={trip.key}>
                        <TripCard key={trip.key} trip={trip} postDeleteTrip={deleteTrip} />
                    </Grid>
                ))}
            </Grid>

            <Button><Link to={NEW_TRIP_URL}>New Trip</Link></Button>
            <Button><Link to={NEW_TRIP_BULK_URL}>Bulk Upload New Trips</Link></Button>

            <Stack direction="row" spacing={1}>
                {tags.map(tag => (
                    <Chip key={tag.tagId} label={tag.name} color="primary" variant="outlined"/>
                ))}
            </Stack>
            <Button onClick={openTagModal}>New tag</Button>
            <Modal
                open={tagModalOpen}
                onClose={closeTagModal}
                aria-labelledby="Tag modal"
                aria-describedby="Tag modal"
            >
                <Box sx={tagModalStyle}>
                    <TagDetails tagId={-1} editType={0} postSaveTag={postSaveTag} />
                </Box>
            </Modal>
        </div>
    );
};
