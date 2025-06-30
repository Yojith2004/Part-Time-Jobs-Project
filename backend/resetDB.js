const sqlite3 = require('sqlite3').verbose();

// Open the database
const db = new sqlite3.Database('jobs.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Drop and recreate the jobs table
db.serialize(() => {
    db.run('DROP TABLE IF EXISTS jobs', (err) => {
        if (err) console.error('Error dropping table:', err);
        else console.log('Table dropped successfully.');
    });

    db.run(`
        CREATE TABLE jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            salary INTEGER NOT NULL,
            role TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Error creating table:', err);
        else console.log('Table created successfully.');
    });
});

db.close();
