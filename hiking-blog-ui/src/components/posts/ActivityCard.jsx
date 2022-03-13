import React, { useCallback } from 'react';
import { makeStyles } from '@mui/styles';
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
import { postApi } from '../../services/api';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

export default function ActivityCard(props) {

    const {id, title, description, pathCoordinates, deleteActivity} = props;
    const classes = useStyles();
    const selectedCoordinates = pathCoordinates.filter((element, index) => {
        return index % 5 === 0;
    });
    const pathCoordinatesString = selectedCoordinates.map(coordinate => `${coordinate.lat},${coordinate.lng}`).join('|');
    const maxLat = Math.max(...selectedCoordinates.map(coordinate => coordinate.lat));
    const minLat = Math.min(...selectedCoordinates.map(coordinate => coordinate.lat));
    const maxLng = Math.max(...selectedCoordinates.map(coordinate => coordinate.lng));
    const minLng = Math.min(...selectedCoordinates.map(coordinate => coordinate.lng));
    const centerLat = (maxLat + minLat) / 2;
    const centerLng = (maxLng + minLng) / 2;
    const staticMapString = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=11&size=400x400&maptype=terrain&path=color:0x0000ff80|weight:5|${pathCoordinatesString}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`

    const handleDelete = useCallback(() => {
        console.log(`Deleting ${title} with key ${id}.`);
        const postData = {
            id: id
        };
        postApi('/api/delete-post', JSON.stringify(postData))
        .then(res => {
            if (res.ok) {
                return res;
            } else {
                throw new Error(`Delete failed with status ${res.status}.`);
            }
        })
        .then(res => {  
            deleteActivity(id);
            alert("Delete success");
        })
        .catch((err) => {
            alert("Delete Error");
            console.log(err);
        });
    }, []);

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={staticMapString}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
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
