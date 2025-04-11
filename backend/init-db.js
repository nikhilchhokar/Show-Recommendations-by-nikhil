const { Pool } = require('pg');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD || 'postgres1',
  port: process.env.DB_PORT || 5000,
};

async function initDatabase() {
  console.log('Starting database initialization...');
  
  // First, connect to the default postgres database
  const pool = new Pool(config);
  const client = await pool.connect();

  try {
    // Create database if it doesn't exist
    await client.query('CREATE DATABASE postgres');
    console.log('Database created successfully');
  } catch (error) {
    if (error.code === '42P04') { // Database already exists
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', error);
      process.exit(1);
    }
  } finally {
    client.release();
    await pool.end();
  }

  // Connect to the new database
  const dbConfig = {
    ...config,
    database: 'postgres',
  };

  console.log('Connecting to show_recommendations database...');
  const dbPool = new Pool(dbConfig);
  const dbClient = await dbPool.connect();

  try {
    // Create tables
    console.log('Creating tables...');
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS shows (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        year VARCHAR(50) NOT NULL,
        type VARCHAR(50) DEFAULT 'series',
        poster VARCHAR(255) NOT NULL,
        imdb_rating VARCHAR(10),
        genre VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        show_id INTEGER REFERENCES shows(id),
        user_id INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        show_name VARCHAR(255) NOT NULL,
        genre VARCHAR(255) NOT NULL,
        recommender_name VARCHAR(255) NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    dbClient.release();
    await dbPool.end();
  }

  console.log('Database initialization complete');
}

initDatabase().catch(console.error); 