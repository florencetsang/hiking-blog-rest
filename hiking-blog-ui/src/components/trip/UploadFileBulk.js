import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DateTime } from 'luxon';
import { createTrip } from '../../services/tripApi';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { TRIPS_URL } from '../header/navUtil';
import { useNavigate } from 'react-router-dom';

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

    const [routeFiles, setRouteFiles] = useState('');
    const [numFiles, setNumFiles] = useState(0);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    const selectFiles = (event) => {
        setRouteFiles(event.target.files);
        setNumFiles(event.target.files.length);    
    };

    // const createTrips = (files) => {
    //     [...files].forEach(file => {
    //         createTrip("Untitled Trip", "", file, [], DateTime.now(), DateTime.now());
    //     });
    // }

    const save = async () => {
        setSaving(true);
        console.log(`Saving [${routeFiles.length}] files.`);
        let promises = [...routeFiles].map(file => createTrip("Untitled Trip", "", file, [], DateTime.now(), DateTime.now()));
        await Promise.all(promises);
        setSaving(false);
        navigate(TRIPS_URL);
    };

    return (
        <Container className={classes.root}>
            <Box sx={{
                padding: '16px'
            }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                    Upload GPX Files
                    <input
                        className={classes.upload}
                        type="file"
                        multiple
                        onChange={selectFiles}
                    />
                </Button>
                <span> { saving? "Saving..." : `${numFiles} files selected.`} </span>
                <Button onClick={save}>Submit</Button>
            </Box>
        </Container>
    );
};
