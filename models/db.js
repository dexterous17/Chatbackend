const sqlite3 = require('sqlite3').verbose();

// Open a connection to the database
const db = new sqlite3.Database('./database/users.db', (err) => {
  if (err) {
    console.error(err.message, "Error in DB file");
  } else {
    console.log('Connected to the database.');
  }
  
});

module.exports = db;
