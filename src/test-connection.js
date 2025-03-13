import pool from './db.js';

async function testConnection() {

  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful. Timestamp:', res.rows[0].now);
  } catch (err) {
    console.error("Error connecting to database", err);
  } finally {
    await pool.end();
  }
}

testConnection();
