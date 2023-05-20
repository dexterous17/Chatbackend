const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const router = express.Router();
const db = require('../models/db')

router.post('/', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (!row) {
      res.status(401).json({ message: 'Email doesnt not exist' });
      return;
    }

    bcrypt.compare(password, row.password, (err, result) => {
      if (err || !result) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }

      const payload = { id: row.id, email: row.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res.json({ token });
    });
  });
});

module.exports = router;
