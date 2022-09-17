import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function toBase64(arr) {
  // arr = new Uint8Array(arr) if it's an ArrayBuffer
  return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''));
}
function Post({ post }) {
  const [image, setImage] = useState('');
  const [rendered, setRendered] = useState(false);
  // navigate hook to render petview
  const navigate = useNavigate();

  // on click render individual petview
  const handleEntryClick = () => {
    const config = {
      method: 'post',
      url: 'http://localhost:8080/feed/post/pet',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { _id: post.petId },
    };
    axios(config)
      .then((pet) => navigate('/petview', { state: { animalsData: pet } }))
      .catch((err) => {
        console.error(err);
      });
    // navigate tag to render petview
  };
  useEffect(() => {
    if (post.image) {
      axios
        .post('/image', {
          post: {
            image: post.image,
            imageType: post.imageType,
          },
        })
        .then((data) => {
          setRendered(true);
          setImage(
            `data:${post.imageType};base64,${toBase64(data.data.Body.data)}`,
          );
        })
        .catch((err) => {
          console.error(err);
          return '';
        });
    } else {
      setRendered(true);
    }
  }, [rendered]);
  return (
    <Card raised sx={{ width: '40vw' }}>
      {(() => {
			  if (image) {
			    return <CardMedia component="img" image={image} alt="" />;
			  }
      })()}

      <CardContent style={{ backgroundColor: '#E3C770' }}>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.message}
        </Typography>
      </CardContent>
      <CardActions style={{ backgroundColor: '#A64B2A' }}>
        <Button
          style={{ backgroundColor: '#FCFFE7', color: '#DEA057' }}
          size="small"
          id="viewpet"
          onClick={handleEntryClick}
        >
          view pet
        </Button>
      </CardActions>
    </Card>
  );
}
Post.propTypes = {
  post: PropTypes.object.isRequired,
};
export default Post;
