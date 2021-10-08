import React from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

export default function UploadFile(props) {    

    const selectFile = (event) => {
        console.log(`Selected file ${event.target.files[0].name}`);
        props.updateFile(event.target.files[0]);
    };

    return (
        <div>
            {/* <p>{props.message}</p> */}
            <input
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={selectFile}
            />
            <div>
                <label htmlFor="raised-button-file">
                    <Button variant="contained" color="default" component="span" startIcon={<CloudUploadIcon />}>
                        Upload GPX File
                    </Button>
                    <span>  {props.currentFile ? props.currentFile.name : "No file selected."}</span>
                </label>
            </div>
        </div>
    );
};
