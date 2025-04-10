const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());

// PostgreSQL connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

console.log('Attempting to connect to database with config:', {
  ...dbConfig,
  password: '***' // Don't log the actual password
});

// Create PostgreSQL pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test connection on startup
pool.connect()
  .then(client => {
    console.log('Successfully connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err);
    console.error('Please check:');
    console.error('1. Is PostgreSQL running?');
    console.error('2. Are the credentials correct?');
    console.error('3. Is the database created?');
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
// Get all shows
app.get('/api/shows', async (req, res) => {
  try {
    console.log('Attempting to fetch shows...');
    
    // First, verify the connection
    const client = await pool.connect();
    console.log('Database connection established');
    
    try {
      // Check if table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'shows'
        );
      `);
      console.log('Shows table exists:', tableCheck.rows[0].exists);

      if (!tableCheck.rows[0].exists) {
        console.log('Shows table does not exist, creating it...');
        await client.query(`
          CREATE TABLE shows (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            year VARCHAR(50) NOT NULL,
            type VARCHAR(50) DEFAULT 'series',
            poster VARCHAR(255) NOT NULL,
            imdb_rating VARCHAR(10),
            genre VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('Shows table created successfully');
      }

      // Now fetch the shows
      const result = await client.query('SELECT * FROM shows ORDER BY title');
      console.log('Number of shows fetched:', result.rows.length);
      console.log('Shows:', result.rows);
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in /api/shows:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      position: error.position,
      where: error.where
    });
    res.status(500).json({ 
      error: 'Failed to fetch shows',
      details: error.message,
      code: error.code
    });
  }
});

// Add a new show
app.post('/api/shows', async (req, res) => {
  const { title, year, type, poster, imdbRating, genre } = req.body;
  console.log('Adding new show:', { title, year, type, poster, imdbRating, genre });
  try {
    const result = await pool.query(
      'INSERT INTO shows (title, year, type, poster, imdb_rating, genre) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, year, type, poster, imdbRating, genre]
    );
    console.log('Show added successfully:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding show:', error);
    res.status(500).json({ 
      error: 'Failed to add show',
      details: error.message 
    });
  }
});

// Get all genres
app.get('/api/genres', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      // Check if genres table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'genres'
        );
      `);

      if (!tableCheck.rows[0].exists) {
        console.log('Genres table does not exist, creating it...');
        await client.query(`
          CREATE TABLE genres (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('Genres table created successfully');
        
        // Insert default genres
        await client.query(`
          INSERT INTO genres (name) VALUES 
          ('Drama'),
          ('Comedy'),
          ('Action'),
          ('Thriller'),
          ('Horror'),
          ('Sci-Fi'),
          ('Fantasy'),
          ('Crime'),
          ('Mystery'),
          ('Romance'),
          ('Adventure'),
          ('Animation'),
          ('Documentary'),
          ('Sitcom')
        `);
        console.log('Default genres inserted successfully');
      }

      const result = await client.query('SELECT name FROM genres ORDER BY name');
      res.json(result.rows.map(row => row.name));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Add a new genre
app.post('/api/genres', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Genre name is required' });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO genres (name) VALUES ($1) RETURNING *',
        [name]
      );
      res.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Genre already exists' });
    } else {
      console.error('Error adding genre:', error);
      res.status(500).json({ error: 'Failed to add genre' });
    }
  }
});

// Get user's favorites
app.get('/api/favorites', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.* FROM shows s
      JOIN favorites f ON s.id = f.show_id
      WHERE f.user_id = 1
      ORDER BY s.title
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add to favorites
app.post('/api/favorites', async (req, res) => {
  const { show_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO favorites (show_id, user_id) VALUES ($1, 1) RETURNING *',
      [show_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove from favorites
app.delete('/api/favorites/:showId', async (req, res) => {
  const { showId } = req.params;
  try {
    await pool.query(
      'DELETE FROM favorites WHERE show_id = $1 AND user_id = 1',
      [showId]
    );
    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Get all recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    console.log('Attempting to fetch recommendations...');
    const client = await pool.connect();
    
    try {
      // Check if recommendations table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'recommendations'
        );
      `);
      console.log('Recommendations table exists:', tableCheck.rows[0].exists);

      if (!tableCheck.rows[0].exists) {
        console.log('Recommendations table does not exist, creating it...');
        await client.query(`
          CREATE TABLE recommendations (
            id SERIAL PRIMARY KEY,
            show_name VARCHAR(255) NOT NULL,
            genre VARCHAR(255) NOT NULL,
            recommender_name VARCHAR(255) NOT NULL,
            reason TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('Recommendations table created successfully');
      }

      const result = await client.query('SELECT * FROM recommendations ORDER BY created_at DESC');
      console.log('Number of recommendations fetched:', result.rows.length);
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Add a new recommendation
app.post('/api/recommendations', async (req, res) => {
  const { showName, genre, recommenderName, reason } = req.body;
  console.log('Adding new recommendation:', { showName, genre, recommenderName, reason });
  
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO recommendations (show_name, genre, recommender_name, reason) VALUES ($1, $2, $3, $4) RETURNING *',
        [showName, genre, recommenderName, reason]
      );
      console.log('Recommendation added successfully:', result.rows[0]);
      res.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error adding recommendation:', error);
    res.status(500).json({ error: 'Failed to add recommendation' });
  }
});

// Delete a recommendation
app.delete('/api/recommendations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM recommendations WHERE id = $1', [id]);
      res.json({ message: 'Recommendation deleted successfully' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    res.status(500).json({ error: 'Failed to delete recommendation' });
  }
});

// Delete a show
app.delete('/api/shows/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Attempting to delete show with ID:', id);
  
  try {
    const client = await pool.connect();
    try {
      // First delete any associated recommendations
      await client.query('DELETE FROM recommendations WHERE show_name IN (SELECT title FROM shows WHERE id = $1)', [id]);
      
      // Then delete the show
      const result = await client.query('DELETE FROM shows WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Show not found' });
      }
      
      console.log('Show deleted successfully:', result.rows[0]);
      res.json({ message: 'Show deleted successfully', show: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting show:', error);
    res.status(500).json({ error: 'Failed to delete show', details: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  console.log(`API endpoints available at http://localhost:${port}/api/`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
}); 