import React, { useState, useCallback } from 'react';
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
import Box from '@material-ui/core/Box';
import * as mapStyle from './MapStyle';

export default function ControlPanel(props) {

    const [open, setOpen] = useState(false);

    const {strokeWeight, setStrokeWeight, strokeColor, setStrokeColor, strokeOpacity, setStrokeOpacity, strokeStyle, setStrokeStyle} = props;

    const handleStrokeWeightChange = useCallback((event) => {
        console.log(`Setting stroke weight to ${event.target.value}`);
        setStrokeWeight(event.target.value);
    }, [setStrokeWeight]);

    const handleStrokeColorChange = useCallback((event) => {
        setStrokeColor(event.target.value);
    }, [setStrokeColor]);

    const handleStrokeOpacityChange = useCallback((event) => {
        setStrokeOpacity(event.target.value);
    }, [setStrokeOpacity]);

    const handleStrokeStyleChange = useCallback((event) => {
        setStrokeStyle(event.target.value);
    }, [setStrokeStyle]);

    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, [setOpen]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    console.log(`Stroke weight is now ${strokeWeight}`);

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
                        <Box mb={1}>
                            <TextField
                                mb={3}
                                value={strokeWeight}
                                onChange={handleStrokeWeightChange}
                                // label="Stroke Weight"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <br />
                        <FormLabel>Stroke Color</FormLabel>
                        <br />
                        <Box mb={1}>
                            <TextField
                                value={strokeColor}
                                onChange={handleStrokeColorChange}
                                // label="Stroke Color"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <br />
                        <FormLabel>Stroke Opacity</FormLabel>
                        <br />
                        <Box mb={1}>
                            <TextField
                                defaultValue={strokeOpacity}
                                onChange={handleStrokeOpacityChange}
                                // label="Stroke Opacity"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <br />
                        <FormLabel>Line Style</FormLabel>
                        <RadioGroup aria-label="stroke-style" name="stroke-style" value={strokeStyle} onChange={handleStrokeStyleChange} >
                            <FormControlLabel value={mapStyle.DASHED} control={<Radio />} label="Dashed Line" />
                            <FormControlLabel value={mapStyle.SOLID} control={<Radio />} label="Solid Line" />
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
