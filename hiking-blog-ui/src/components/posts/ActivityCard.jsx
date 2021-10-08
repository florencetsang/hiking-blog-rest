import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

const axios = require('axios').default;

export default function ActivityCard(props) {
    const classes = useStyles();
    const selectedCoordinates = props.pathCoordinates.filter((element, index) => {
        return index % 5 === 0;
    });
    const pathCoordinatesString = selectedCoordinates.map(coordinate => coordinate.lat + ',' + coordinate.lng).join('|');
    const maxLat = Math.max.apply(null, selectedCoordinates.map(coordinate => coordinate.lat));
    const minLat = Math.min.apply(null, selectedCoordinates.map(coordinate => coordinate.lat));
    const maxLng = Math.max.apply(null, selectedCoordinates.map(coordinate => coordinate.lng));
    const minLng = Math.min.apply(null, selectedCoordinates.map(coordinate => coordinate.lng));
    const centerLat = (maxLat + minLat) / 2;
    const centerLng = (maxLng + minLng) / 2;
    const staticMapString = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=11&size=400x400&maptype=terrain&path=color:0x0000ff80|weight:5|${pathCoordinatesString}&key=AIzaSyDAkQIEvrwQHfvmPLuTjGo9hzO0HDVgAJc`

    const handleDelete = () => {
        console.log(`Deleting ${props.title} with key ${props.id}.`);
        axios
            .post(`http://localhost:8080/delete-post/?id=${props.id}`)
            .then((res) => {
                alert("Delete success");
            })
            .catch((err) => alert("Delete Error"));
    }

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
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.description}
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