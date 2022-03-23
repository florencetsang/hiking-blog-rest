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
        // if (event.target.files.length) {
        //     console.log(`Selected file ${event.target.files[0].name}`);
        //     updateFile(event.target.files[0]);
        // } else { 
        //     console.log("No file selected!");
        // }        
    };

    const createTrips = (files) => {
        [...files].forEach(file => {
            createTrip("Untitled Trip", "", file, [], DateTime.now(), DateTime.now());
        });
        
    }

    const save = async () => {
        setSaving(true);
        console.log(`Saving [${routeFiles.length}] files.`);
        let promises = [...routeFiles].map(file => createTrip("Untitled Trip", "", file, [], DateTime.now(), DateTime.now()));
        await Promise.all(promises);
        setSaving(false);
        navigate(TRIPS_URL);
        
        // createTrips(routeFiles);
        // console.log('Saved trips');
        // navigate(TRIPS_URL);
        // let res;
        // if (editType === 'ADD') {
        //     res = await createTrip(name, description, routeFile, tags.map(tag => tag.tagId), fromDate, toDate);
        // } else {
        //     // TODO
        //     res = true;
        // }
        // if (res) {
        //     console.log('saved trip');
        //     navigate(TRIPS_URL);
        // } else {
        //     console.log('cannot save trip');
        // }
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
