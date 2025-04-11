import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  Stack
} from '@mui/material';

function ShowCard({ show }) {
  console.log('ShowCard received show:', show);
  
  // Convert rating to number for the Rating component
  const ratingValue = show.imdb_rating === 'N/A' ? 0 : parseFloat(show.imdb_rating) / 2;
  
  // Split genres into array if they exist
  const genres = show.genre ? show.genre.split(',').map(g => g.trim()) : [];

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={show.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
        alt={show.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {show.title}
        </Typography>
        {show.year && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {show.year}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={ratingValue} 
            precision={0.5} 
            readOnly 
            size="small"
          />
          {show.imdb_rating && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {show.imdb_rating}
            </Typography>
          )}
        </Box>
        {genres.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {genres.map((genre, index) => (
              <Chip 
                key={index}
                label={genre}
                size="small"
                sx={{ 
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  mb: 0.5
                }}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default ShowCard; 