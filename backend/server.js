require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5001;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'https://show-recommendations-by-nikhil-vw5l.vercel.app', 'https://www.nikhilrecommends.click'], // Add your Vercel frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.get('/api/shows', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shows');
    res.json(result.rows || []); // Return an empty array if no rows are found
  } catch (err) {
    console.error('Error fetching shows:', err);
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
});

app.post('/api/shows', async (req, res) => {
  const { title, year, genre, poster, imdb_rating } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO shows (title, year, genre, poster, imdb_rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, year, genre, poster, imdb_rating]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding show:', err);
    res.status(500).json({ error: 'Failed to add show' });
  }
});

app.delete('/api/shows/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM shows WHERE id = $1', [id]);
    res.json({ message: 'Show deleted successfully' });
  } catch (err) {
    console.error('Error deleting show:', err);
    res.status(500).json({ error: 'Failed to delete show' });
  }
});

// Get all recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recommendations ORDER BY created_at DESC');
    res.json(result.rows || []); // Return an empty array if no rows are found
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Add a new recommendation
app.post('/api/recommendations', async (req, res) => {
  const { show_name, genre, recommender_name, reason } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO recommendations (show_name, genre, recommender_name, reason, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [show_name, genre, recommender_name, reason]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding recommendation:', err);
    res.status(500).json({ error: 'Failed to add recommendation' });
  }
});

// Delete a recommendation
app.delete('/api/recommendations/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid recommendation ID' });
  }
  try {
    const result = await pool.query('DELETE FROM recommendations WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    res.json({ message: 'Recommendation deleted successfully' });
  } catch (err) {
    console.error('Error deleting recommendation:', err);
    res.status(500).json({ error: 'Failed to delete recommendation' });
  }
});

// Get all genres
app.get('/api/genres', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM genres ORDER BY name ASC');
    res.json(result.rows.map(row => row.name)); // Return an array of genre names
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
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