import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, rank FROM users');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    await pool.query("INSERT INTO users (name, email, password_hash, role, rank) VALUES ('Admin', 'admin@filhosdofogo.com', 'hash', 'admin', 'Mestre') ON CONFLICT DO NOTHING");
    res.json({ message: 'Database seeded' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on port ${port}`);
});
