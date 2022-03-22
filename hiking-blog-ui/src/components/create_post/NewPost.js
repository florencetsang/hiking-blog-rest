import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import UploadFile from './UploadFile';
import { postFormData } from '../../services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  }
}));

export default function NewPost() {

  const classes = useStyles();
  const [currentFile, setCurrentFile] = useState(null);
  const [name, setName] = useState("New Trail Record");
  const [description, setDescription] = useState("Descrtipion.");

  const updateFile = (file) => {
    setCurrentFile(file);
  }

  const updateName = (event) => {
    setName(event.target.value);
  }

  const updateDescription = (event) => {
    setDescription(event.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`NewPost Form is submitted. File: [${currentFile.name}]. Name: [${name}]. Description: [${description}].`);

    const fd = new FormData();
    fd.append("file", currentFile);
    fd.append("name", name);
    fd.append("description", description);

    postFormData('/api/create-post', fd)
    .then((res) => {
      alert("File Upload success");
    })
    .catch((err) => {
      alert("File Upload Error");
      console.log(err);
    });
  }

  return (
    <Container fixed>
      
      <Box marginTop={10} marginBottom={30}>
        <form onSubmit={handleSubmit} className={classes.root}>
          <h2>New Route</h2>          
          <UploadFile message="Upload gpx file" updateFile={updateFile} currentFile={currentFile} />
          <TextField
            label="Name"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
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
            onChange={updateDescription}
          />
          <Button variant="contained" type="submit" >Post</Button>
        </form>
      </Box>
    </Container>
  );
}