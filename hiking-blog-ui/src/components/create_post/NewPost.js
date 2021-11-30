import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import UploadFile from './UploadFile';
import { getAuth } from "firebase/auth";


const axios = require('axios').default;

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
  const auth = getAuth();
  const [token, setToken] = useState(null);

  const updateFile = (file) => {
    setCurrentFile(file);
  }

  const updateName = (event) => {
    setName(event.target.value);
  }

  const updateDescription = (event) => {
    setDescription(event.target.value);
  }

  const handleSubmit = (e) => {

    auth.currentUser?.getIdToken(false).then(function(idToken){
      setToken(idToken);
      console.log(`Token: ${idToken}`);
    }).catch((err)=>{
      console.log(error);
    })

    e.preventDefault();
    console.log(`NewPost Form is submitted. File: [${currentFile.name}]. Name: [${name}]. Token: [${token}]. Description: [${description}].`);
    const fd = new FormData();
    fd.append("file", currentFile);
    fd.append("name", name);
    fd.append("description", description);
    fd.append("token", token)

    axios
      .post('/create-post', fd)
      .then((res) => {
        alert("File Upload success");
      })
      .catch((err) => {
        alert("File Upload Error");
        console.log(error);
      });
  }

  // console.log(`Auth is ${auth}`);
  // console.log(`Auth currentUser is ${auth.currentUser}`);
  // console.log(`Auth token is ${auth.currentUser?.getIdToken(false)}`);

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
          <Button variant="contained" color="primary" type="submit" >Post</Button>
        </form>
      </Box>
    </Container>
  );
}
