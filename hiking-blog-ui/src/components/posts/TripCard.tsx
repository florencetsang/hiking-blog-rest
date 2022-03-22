import React, { useCallback } from 'react';

import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import { getMapsImgUrl } from './RouteStaticMap';
import { deleteTrip } from '../../services/tripApi';
import { getTripDetailsUrl } from '../header/navUtil';

import { Trip } from '../../data/trip';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

interface TripCardProps {
    trip: Trip;
    postDeleteTrip: (key: number) => void;
}

export default function TripCard(props: TripCardProps) {
    const {trip, postDeleteTrip} = props;
    const classes = useStyles();

    const mapsUrl = getMapsImgUrl(trip.pathCoordinates);

    const handleDelete = useCallback(async () => {
        console.log(`Deleting ${trip.name} with key ${trip.key}.`);
        const res = await deleteTrip(trip.key);
        if (res) {
            postDeleteTrip(trip.key);
            alert("Delete success");
        } else {
            alert("Delete Error");
        };
    }, []);

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={mapsUrl}
                    title={trip.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {trip.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {trip.description}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {trip.tags.map(tag => (
                            <Chip key={tag.tagId} label={tag.name}/>
                        ))}
                    </Stack>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <CardActions>
                    <Button size="small"><Link to={getTripDetailsUrl(trip.key)}>Details</Link></Button>
                </CardActions>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <IconButton aria-label="delete activity" onClick={handleDelete}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
