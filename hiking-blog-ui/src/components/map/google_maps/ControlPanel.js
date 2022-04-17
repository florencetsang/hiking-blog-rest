import React, { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import IconButton from '@mui/material/IconButton';
import TuneIcon from '@mui/icons-material/Tune';
import Box from '@mui/material/Box';
import { StrokeStyle } from './data';

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
                            <FormControlLabel value={StrokeStyle.DASHED} control={<Radio />} label="Dashed Line" />
                            <FormControlLabel value={StrokeStyle.SOLID} control={<Radio />} label="Solid Line" />
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
