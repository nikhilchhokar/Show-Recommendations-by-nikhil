const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'show_recommendations',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5000,
});

const sampleShows = [
  {
    title: "Breaking Bad",
    year: "2008-2013",
    type: "series",
    poster: "https://images.alphacoders.com/900/thumb-1920-900419.jpg",
    imdbRating: "9.5",
    genre: "Crime, Drama, Thriller"
  },
  {
    title: "Stranger Things",
    year: "2016-Present",
    type: "series",
    poster: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    imdbRating: "8.7",
    genre: "Drama, Fantasy, Horror"
  }
];

async function seedDatabase() {
  console.log('Starting database seeding...');
  const client = await pool.connect();
  
  try {
    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'shows'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating shows table...');
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

    // Clear existing data
    console.log('Clearing existing shows...');
    await client.query('DELETE FROM shows');
    console.log('Existing shows cleared');

    // Insert sample data
    console.log('Inserting sample shows...');
    for (const show of sampleShows) {
      const result = await client.query(
        'INSERT INTO shows (title, year, type, poster, imdb_rating, genre) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [show.title, show.year, show.type, show.poster, show.imdbRating, show.genre]
      );
      console.log('Inserted show:', result.rows[0].title);
    }

    // Verify the data was inserted
    const verify = await client.query('SELECT COUNT(*) FROM shows');
    console.log(`Total shows in database: ${verify.rows[0].count}`);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding process
seedDatabase()
  .then(() => {
    console.log('Seeding process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }); 