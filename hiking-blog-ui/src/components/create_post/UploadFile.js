import React from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'none',
    }
  }));

export default function UploadFile(props) {

    const classes = useStyles();

    const {currentFile = null, updateFile} = props;    

    const selectFile = (event) => {
        if (event.target.files.length) {
            console.log(`Selected file ${event.target.files[0].name}`);
            updateFile(event.target.files[0]);
        } else { 
            console.log("No file selected!");
        }
    };

    return (
        <div>
            <Button variant="contained" color="default" component="label" startIcon={<CloudUploadIcon />}>
                Upload GPX File
                <input
                    className={classes.root}
                    type="file"
                    onChange={selectFile}
                />
            </Button>
            <span>  {currentFile ? currentFile.name : "No file selected."}</span>
        </div>
    );
};
