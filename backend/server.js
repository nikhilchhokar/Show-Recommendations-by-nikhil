require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'https://show-recommendations-app.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Mock data
let shows = [
  {
    id: 1,
    title: "Breaking Bad",
    year: "2008-2013",
    genre: "Crime, Drama, Thriller",
    poster: "https://m.media-amazon.com/images/M/MV5BMTJiMzgwZTktYzZhZC00YzhhLWEzZDUtMGM2NTE4MzQ4NGFmXkEyXkFqcGdeQWpybA@@._V1_.jpg",
    imdb_rating: "9.5"
  },
  {
    id: 2,
    title: "Stranger Things",
    year: "2016-Present",
    genre: "Drama, Fantasy, Horror",
    poster: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    imdb_rating: "8.7"
  }
];

// Routes
app.get('/api/shows', (req, res) => {
  console.log('Fetching shows...');
  res.json(shows);
});

app.post('/api/shows', (req, res) => {
  const newShow = {
    id: shows.length + 1,
    ...req.body
  };
  shows.push(newShow);
  res.json(newShow);
});

app.delete('/api/shows/:id', (req, res) => {
  const id = parseInt(req.params.id);
  shows = shows.filter(show => show.id !== id);
  res.json({ message: 'Show deleted successfully' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  console.log(`API endpoints available at http://localhost:${port}/api/`);
}); 