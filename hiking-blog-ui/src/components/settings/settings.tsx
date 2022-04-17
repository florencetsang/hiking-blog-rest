import React, {useState} from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material';

import { getInitialMapType, saveMapType } from '../../utils/map';
import { MapType } from '../../data/map';

interface SettingsProps {

}

const Settings = (props: SettingsProps) => {
  const [mapType, setMapTpe] = useState(getInitialMapType());

  const onMapTypeChange = (event: SelectChangeEvent<MapType>) => {
    setMapTpe(event.target.value as MapType);
    saveMapType(event.target.value as MapType);
  };

  return (
    <Box sx={{
      padding: '16px'
    }}>
      <List>
        <ListItem
          secondaryAction={
            <FormControl fullWidth>
              <InputLabel id="map-type-select-label">Map Type</InputLabel>
              <Select
                labelId="map-type-select-label"
                id="map-type-select"
                value={mapType}
                label="Map Type"
                onChange={onMapTypeChange}
              >
                <MenuItem value={MapType.GOOGLE}>Google</MenuItem>
                <MenuItem value={MapType.OPENSTREETMAP}>OpenStreetMap</MenuItem>
              </Select>
            </FormControl>
          }
          disablePadding>
          <ListItemText primary="Map" />
        </ListItem>
      </List>
    </Box>
  );
}

export default Settings;
