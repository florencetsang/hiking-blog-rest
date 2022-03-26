import React, { useState, useEffect, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DateAdapter from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { makeStyles } from '@mui/styles';
import { DateTime } from 'luxon';

import { useNavigate, useParams } from 'react-router-dom';

import { RouteStaticMap } from '../posts/RouteStaticMap';
import UploadFile from './UploadFile';

import { getTrip, createTrip, editTrip } from '../../services/tripApi';
import { getTagByName } from '../../services/tagApi';

import { TRIPS_URL } from '../header/navUtil';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  }
}));

export default function TripDetails() {
  const classes = useStyles();

  const { tripId } = useParams();
  const editType = tripId === '_new' ? 'ADD' : 'UPDATE';
  const navigate = useNavigate();

  const [routeFile, setRouteFile] = useState(null);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [pathCoordinates, setPathCoordinates] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagNameSearch, setTagNameSearch] = useState('');
  const [fromDate, setFromDate] = useState(DateTime.now());
  const [toDate, setToDate] = useState(DateTime.now());

  useEffect(() => {
    if (editType === 'ADD') {
      return;
    }
    let didCancel = false;
    const _getActivity = async () => {
      const trip = await getTrip(tripId);
      if (trip) {
        if (!didCancel) {
          setName(trip.name);
          setDescription(trip.description);
          setPathCoordinates(trip.pathCoordinates);
          setTags(trip.tags);
          setFromDate(trip.fromDate);
          setToDate(trip.toDate);
        }
      }
    };
    _getActivity();
    return () => {didCancel = true;};
  }, [tripId, setName, setDescription, setPathCoordinates, setTags, setFromDate, setToDate]);

  const updateRouteFile = useCallback((file) => {
    setRouteFile(file);
  }, [setRouteFile]);

  const updateName = useCallback((event) => {
    setName(event.target.value);
  }, [setName]);

  const updateDescription = useCallback((event) => {
    setDescription(event.target.value);
  }, [setDescription]);

  const updateTagNameSearch = useCallback((event) => {
    setTagNameSearch(event.target.value);
  }, [setTagNameSearch]);

  const searchAndAddTag = useCallback(async () => {
    const tag = await getTagByName(tagNameSearch);
    if (tag) {
      setTags(tags => {
        const sameTagIdx = tags.findIndex(oldTag => oldTag.tagId === tag.tagId);
        return sameTagIdx < 0 ? [...tags, tag] : tags;
      });
    } else {
      alert(`There is no tag with tag name ${tagNameSearch}.`);
    }
  }, [tagNameSearch, setTags]);

  const removeTag = useCallback((tagId) => {
    setTags(tags => tags.filter(tag => tag.tagId !== tagId));
  }, [setTags]);

  const updateFromDate = useCallback((date) => {
    setFromDate(date);
  }, [setFromDate]);

  const updateToDate = useCallback((date) => {
    setToDate(date);
  }, [setToDate]);

  const validate = useCallback(() => {
    return name.trim().length > 0
        && fromDate.startOf('day') <= toDate.startOf('day');
  }, [name, fromDate, toDate]);

  const save = async () => {
    if (!validate()) {
      console.log('invalid trip details to save');
      return;
    }    
    let res;
    if (editType === 'ADD') {
      console.log(`Form is submitted. File: [${routeFile.name}]. Name: [${name}]. Description: [${description}]. fromDate: ${fromDate}, toDate: ${toDate}`);
      res = await createTrip(name, description, routeFile, tags.map(tag => tag.tagId), fromDate, toDate);
    } else {
      console.log(`Form is submitted. Name: [${name}]. Description: [${description}]. fromDate: ${fromDate}, toDate: ${toDate}`);
      res = await editTrip(tripId, name, description, tags.map(tag => tag.tagId), fromDate, toDate);
    }
    if (res >= 0) {
      console.log('saved trip');
      navigate(TRIPS_URL);
    } else {
      console.log('cannot save trip');
    }
  };

  return (
    <Container className={classes.root}>
      <Box sx={{
        padding: '16px'
      }}>
        { editType == 'ADD' && <UploadFile message="Upload gpx file" updateFile={updateRouteFile} currentFile={routeFile} /> }
        <TextField
          label="Name"
          style={{ margin: 8 }}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={name}
          onChange={updateName}
          inputProps={{ maxLength: 12 }}
        />
        <TextField
          label="Description"
          style={{ margin: 8 }}
          fullWidth
          multiline
          rows={5}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={description}
          onChange={updateDescription}
        />

        <div>
          <TextField label="Tag name" value={tagNameSearch} onChange={updateTagNameSearch} margin="normal"/>
          <Button variant="contained" onClick={searchAndAddTag}>Search and Add Tag</Button>
          <Stack direction="row" spacing={1}>
            {tags.map(tag => (
              <Chip key={tag.tagId} label={tag.name} onDelete={() => removeTag(tag.tagId)}/>
            ))}
          </Stack>
        </div>

        <div>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              label="From Date"
              inputFormat="yyyy-MM-dd"
              value={fromDate}
              onChange={updateFromDate}
              renderInput={(params) => <TextField {...params} margin="normal"/>}
            />
            <DatePicker
              label="To Date"
              inputFormat="yyyy-MM-dd"
              value={toDate}
              onChange={updateToDate}
              renderInput={(params) => <TextField {...params} margin="normal"/>}
            />
          </LocalizationProvider>
        </div>

        {
          editType === 'UPDATE' && pathCoordinates != null
          && (
            <div>
              <RouteStaticMap pathCoordinates={pathCoordinates}/>
            </div>
          )
        }

        <div>
          <Button variant="contained" onClick={save}>Save</Button>
        </div>
      </Box>
    </Container>
  );
}
