import React, { useState, useEffect, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';

import { useNavigate, useParams } from 'react-router-dom';

import { RouteStaticMap } from '../posts/RouteStaticMap';
import UploadFile from './UploadFile';

import { getTrip, createTrip } from '../../services/tripApi';
import { getTagByName } from '../../services/tagApi';

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

  useEffect(() => {
    if (editType !== 'UPDATE') {
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
        }
      }
    };
    _getActivity();
    return () => {didCancel = true;};
  }, [tripId, setName, setDescription, setPathCoordinates, setTags]);

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

  const validate = useCallback(() => {
    return name.trim().length > 0;
  }, [name]);

  const save = async () => {
    if (!validate()) {
      console.log('invalid trip details to save');
      return;
    }
    console.log(`Form is submitted. File: [${routeFile.name}]. Name: [${name}]. Description: [${description}].`);
    let res;
    if (editType === 'ADD') {
      res = await createTrip(name, description, routeFile, tags.map(tag => tag.tagId));
    } else {
      // TODO
      res = true;
    }
    if (res) {
      console.log('saved trip');
      navigate('/trips');
    } else {
      console.log('cannot save trip');
    }
  };

  return (
    <Container className={classes.root}>
      <Box sx={{
        padding: '16px'
      }}>
        <UploadFile message="Upload gpx file" updateFile={updateRouteFile} currentFile={routeFile} />
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
          <TextField label="Tag name" value={tagNameSearch} onChange={updateTagNameSearch}/>
          <Button variant="contained" onClick={searchAndAddTag}>Search and Add Tag</Button>
          <Stack direction="row" spacing={1}>
            {tags.map(tag => (
              <Chip key={tag.tagId} label={tag.name} onDelete={() => removeTag(tag.tagId)}/>
            ))}
          </Stack>
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
