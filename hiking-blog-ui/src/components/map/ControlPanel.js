import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import TuneIcon from '@material-ui/icons/Tune';

export default function ControlPanel(props) {

    const [open, setOpen] = useState(false);

    const handleStrokeWeightChange = (event) => {
        console.log(`Setting stroke weight to ${event.target.value}`);
        props.setStrokeWeight(event.target.value);
    }

    const handleStrokeColorChange = (event) => {
        props.setStrokeColor(event.target.value);
    }

    const handleStrokeOpacityChange = (event) => {
        props.setStrokeOpacity(event.target.value);
    }

    const handleDottedStrokeChange = (event) => {
        console.log(`Setting dotted stroke value to ${event.target.value}`);
        props.setDottedStroke(eval(event.target.value));
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    console.log(`Stroke weight is now ${props.strokeWeight}`);

    return (

        <div>
            {/* <Button onClick={handleClickOpen}>Visual Settings</Button> */}
            <IconButton aria-label="Visual Settings" onClick={handleClickOpen}>
                <TuneIcon />
            </IconButton>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Visual settings</DialogTitle>
                <DialogContent>
                    <form >
                        <FormLabel>Stroke Weight</FormLabel>
                        <br />
                        <TextField
                            value={props.strokeWeight}
                            onChange={handleStrokeWeightChange}
                            // label="Stroke Weight"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <br /><br />
                        <FormLabel>Stroke Color</FormLabel>
                        <br />
                        <TextField
                            value={props.strokeColor}
                            onChange={handleStrokeColorChange}
                            // label="Stroke Color"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <br /><br />
                        <FormLabel>Stroke Opacity</FormLabel>
                        <br />
                        <TextField
                            defaultValue={props.strokeOpacity}
                            onChange={handleStrokeOpacityChange}
                            // label="Stroke Opacity"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <br /><br />
                        <FormLabel>Line Style</FormLabel>
                        <RadioGroup aria-label="stroke-style" name="stroke-style" value={props.dottedStroke.toString()} onChange={handleDottedStrokeChange}>
                            <FormControlLabel value="true" control={<Radio />} label="Dashed Line" />
                            <FormControlLabel value="false" control={<Radio />} label="Solid Line" />
                        </RadioGroup>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};