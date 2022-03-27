import React, { useState, useContext } from 'react';

import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';

import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';

import { createTrip } from '../../services/tripApi';
import { LoadingContext } from '../context/LoadingContext';
import { TRIPS_URL } from '../header/navUtil';

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
    },
    upload: {
        display: 'none'
    }
}));

export default function UploadFileBulk(props) {
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();
    const appLoading = useContext(LoadingContext);

    const [routeFiles, setRouteFiles] = useState([]);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    const selectFiles = (event) => {
        setRouteFiles(event.target.files);
    };

    const save = async () => {
        const loadingId = appLoading.load();
        console.log(`Saving [${routeFiles.length}] files.`);
        const promises = [...routeFiles].map(file => createTrip(file.name, "", file, [], DateTime.now(), DateTime.now()));
        const resList = await Promise.all(promises);
        if (!resList.some((res) => res < 0)) {
            console.log('Saved all trips.');
        } else {
            const failedList = resList.map((_, i) => i).filter(e => resList[e] === -1).map(i => routeFiles[i].name);
            console.log(`Some trips failed to save: ${failedList}`);
            enqueueSnackbar(`Some trips failed to save: ${failedList}`);
        }
        appLoading.unLoad(loadingId);
        navigate(TRIPS_URL);
    };

    return (
        <Box sx={{
            padding: '16px',
            textAlign: 'center'
        }}>
            <Button disabled={appLoading.isLoading} variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Upload GPX Files
                <input
                    className={classes.upload}
                    type="file"
                    multiple
                    onChange={selectFiles}
                />
            </Button>
            <span> {appLoading.isLoading ? "Saving..." : `${routeFiles.length} files selected.`} </span>
            <Button disabled={appLoading.isLoading} onClick={save}>Submit</Button>
        </Box>
    );
};
