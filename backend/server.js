const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 50001;

const db = new sqlite3.Database('jobs.db', (err) => {
  if (err) console.error("Error opening database:", err);
  else console.log("Connected to SQLite database.");
});

// Create tables if they don't exist
const createTablesSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    salary INTEGER NOT NULL,
    role TEXT NOT NULL
  );
`;

db.exec(createTablesSQL, (err) => {
  if (err) console.error("Error creating tables:", err);
  else console.log("Tables created successfully!");
});

app.use(express.json());
app.use(cors());

// Register User
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], function (err) {
    if (err) {
      res.status(500).send({ message: 'Error registering user', error: err });
    } else {
      res.status(201).send({ message: 'User registered successfully', userId: this.lastID });
    }
  });
});

// Login User
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    console.log(`User Logged In: ${username} (Role: ${user.role})`); // Debugging

    res.status(200).send({ 
      message: 'Login successful', 
      userId: user.id, 
      role: user.role 
    });
  });
});

// Fetch All Jobs (Now Supports Search)
app.get('/api/jobs', (req, res) => {
  const searchQuery = req.query.query ? `%${req.query.query}%` : "%";

  db.all('SELECT * FROM jobs WHERE title LIKE ? OR description LIKE ? OR location LIKE ?', 
    [searchQuery, searchQuery, searchQuery], 
    (err, jobs) => {
      if (err) {
        res.status(500).send({ message: 'Error fetching jobs', error: err });
      } else {
        res.status(200).json(jobs);
      }
    });
});

// Post a Job (Only Logged-in Users)
app.post('/api/jobs', (req, res) => {
  const { title, description, location, salary, role } = req.body;

  if (!title || !description || !location || !salary || !role) {
    return res.status(400).send({ message: 'All job fields are required' });
  }

  db.run(
  'INSERT INTO jobs (title, description, location, salary, role) VALUES (?, ?, ?, ?, ?)',
  [title, description, location, salary, role],
  function (err) {
    if (err) {
      console.error("Database Error:", err); // Debugging
      res.status(500).send({ message: 'Error adding job', error: err.message });
    } else {
      res.status(201).send({ message: 'Job added successfully', jobId: this.lastID });
    }
  });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
