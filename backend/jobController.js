// jobController.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('jobs.db');

exports.getJobs = (req, res) => {
  db.all("SELECT * FROM jobs", [], (err, rows) => {
    if (err) return res.status(500).send({ error: err });
    res.json(rows);
  });
};

exports.createJob = (req, res) => {
  const { title, description, location, salary } = req.body;
  db.run('INSERT INTO jobs (title, description, location, salary) VALUES (?, ?, ?, ?)', [title, description, location, salary], function(err) {
    if (err) return res.status(500).send({ error: err });
    res.status(201).send({ message: 'Job created successfully', jobId: this.lastID });
  });
};
