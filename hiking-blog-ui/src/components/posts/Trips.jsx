import React, { useState, useEffect, useCallback, useContext } from 'react';

import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSnackbar } from 'notistack';

import { useLocation, useNavigate } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { useAnalytics } from 'reactfire';

import TripCard from './TripCard';
import TagDetails from '../tag/TagDetails';

import { getTrips, deleteTrip } from '../../services/tripApi';
import { getTags } from '../../services/tagApi';
import { NEW_TRIP_URL } from '../header/navUtil';
import { NEW_TRIP_BULK_URL } from './../header/navUtil';
import { LoadingContext } from '../context/LoadingContext';
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
    const location = useLocation();
    const navigate = useNavigate();
    const analytics = useAnalytics();

    const { enqueueSnackbar } = useSnackbar();
    const appLoading = useContext(LoadingContext);

    const [trips, setTrips] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagModalOpen, setTagModalOpen] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);

    const handleDeleteTrip = useCallback(async () => {
        const tripId = tripToDelete.key;
        console.log(`Deleting ${tripToDelete.name} with key ${tripId}.`);
        setTripToDelete(null);
        const loadingId = appLoading.load();
        const res = await deleteTrip(tripId);
        appLoading.unLoad(loadingId);
        if (res) {
            setTrips(trips => trips.filter(trip => trip.key !== tripId));
            enqueueSnackbar("Delete success");
        } else {
            enqueueSnackbar("Delete Error");
        };
    }, [tripToDelete, setTrips]);

    useEffect(() => {
        let didCancel = false;
        const loadingId = appLoading.load();
        const _loadTrips = async () => {
            console.log("Fetching trips.");
            const trips = await getTrips();
            appLoading.unLoad(loadingId);
            if (!didCancel) {
                setTrips(trips);
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
        const loadingId = appLoading.load();
        const _loadTags = async () => {
            const tags = await getTags();
            appLoading.unLoad(loadingId);
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

    const confirmDelete = useCallback((trip) => {
        if (!appLoading.isLoading) {
            setTripToDelete(trip);
        }
    }, [setTripToDelete]);
    const closeConfirmDeleteModal = useCallback(() => setTripToDelete(null), [setTripToDelete]);

    const goToNewTrip = useCallback(() => navigate(NEW_TRIP_URL), []);
    const goToBulkUpload = useCallback(() => navigate(NEW_TRIP_BULK_URL), []);

    useEffect(() => {
        logEvent(analytics, 'page_view', { page_location: location.pathname });
    });

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
                        <TripCard key={trip.key} trip={trip} confirmDelete={confirmDelete} />
                    </Grid>
                ))}
            </Grid>

            <SpeedDial
                ariaLabel="New trip"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon/>}
            >
                    <SpeedDialAction
                        icon={<AddIcon/>}
                        tooltipTitle="New"
                        onClick={goToNewTrip}
                        tooltipOpen
                    />
                    <SpeedDialAction
                        icon={<UploadFileIcon/>}
                        tooltipTitle="Trips"
                        onClick={goToBulkUpload}
                        tooltipOpen
                    />
            </SpeedDial>

            <Stack direction="row" spacing={1}>
                {tags.map(tag => (
                    <Chip key={tag.tagId} label={tag.name} color="primary" variant="outlined"/>
                ))}
            </Stack>
            <Button onClick={openTagModal}>New tag</Button>
            <Modal
                open={tagModalOpen}
                onClose={closeTagModal}
                aria-label="New tag modal"
            >
                <Box sx={tagModalStyle}>
                    <TagDetails tagId={-1} editType={0} postSaveTag={postSaveTag} />
                </Box>
            </Modal>

            <Dialog
                open={tripToDelete !== null}
                onClose={closeConfirmDeleteModal}
                aria-label="Delete trip modal"
            >
                <DialogTitle>Delete trip {tripToDelete && tripToDelete.name}?</DialogTitle>
                <DialogActions>
                    <Button onClick={closeConfirmDeleteModal}>Cancel</Button>
                    <Button onClick={handleDeleteTrip}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
