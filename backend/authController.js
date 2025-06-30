// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db'); // Change database as needed

// Register new user
exports.register = (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });
    
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) return res.status(500).json({ error: 'Error creating user' });
      res.status(201).json({ message: 'User created', userId: this.lastID });
    });
  });
};

// Login user
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: 'Error fetching user' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: 'Error comparing passwords' });
      if (!match) return res.status(401).json({ error: 'Incorrect password' });

      const token = jwt.sign({ userId: user.id }, 'secretkey');
      res.status(200).json({ message: 'Login successful', token });
    });
  });
};
