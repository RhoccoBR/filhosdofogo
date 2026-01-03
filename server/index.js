const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, nickname FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    const users = [
      { name: 'Marcos Antonio Soares Rodrigues', nickname: 'Anjo de Fogo', email: 'mestrefogo64@gmail.com', password: 'anjodefogogcff', role: 'admin' },
      { name: 'Jean da Silva Ramos', nickname: 'Aquiles', email: 'jeanstiflerramos@gmail.com', password: 'aquilesgcff', role: 'admin' },
      { name: 'Adriano de Freitas e Souza', nickname: 'Wolverine', email: 'adrinowol@gmail.com', password: 'wolverinegcff', role: 'admin' },
      { name: 'Vicente José Ferreira neto', nickname: 'Anu Branco', email: 'nb8124369@gmail.com', password: 'anubrancogcff', role: 'professor' },
      { name: 'Jefferson dos Santos Gomes', nickname: 'Zeus', email: 'jeffersongomezntt@gmail.com', password: 'zeusgcff', role: 'professor' },
      { name: 'Roberto Santos Merlino', nickname: 'Pequeno Fogo', email: 'robertomerlinorj@gmail.com', password: 'pequenofogogcff', role: 'professor' },
      { name: 'Wallace Carlos de Almeida', nickname: 'Fênix', email: 'wcaaantos@gmail.com', password: 'fenixgcff', role: 'professor' },
      { name: 'Gutierrez Henrique Moreira da Silva', nickname: 'Gigante', email: 'henriquegutierrez115@gmail.com', password: 'gigantegcff', role: 'professor' },
      { name: 'Manoel Carlos Souza de Araujo', nickname: 'Anjo de Luz', email: 'manoelcarlos232418@gmail.com', password: 'anjodeluzgcff', role: 'professor' },
      { name: 'Vitor Geraldo Carbunk', nickname: 'Lion', email: 'vitor.carbunk1@gmail.com', password: 'liongcff', role: 'professor' }
    ];

    for (const user of users) {
      await pool.query(
        "INSERT INTO users (name, nickname, email, password, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET name = $1, nickname = $2, password = $4, role = $5",
        [user.name, user.nickname, user.email, user.password, user.role]
      );
    }
    res.json({ message: 'Banco de dados atualizado com administradores e professores' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT id, name, email, role, nickname, phone, address, bio, profile_picture_url FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', async (req, res) => {
  const { id, name, nickname, phone, address, bio, profile_picture_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, nickname = $2, phone = $3, address = $4, bio = $5, profile_picture_url = $6 WHERE id = $7 RETURNING id, name, email, role, nickname, phone, address, bio, profile_picture_url',
      [name, nickname, phone, address, bio, profile_picture_url, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log('Backend server running on port ' + port);
});
