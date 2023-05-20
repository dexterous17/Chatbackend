const db = require('./db');
const bcrypt = require('bcrypt')
const saltRounds = 10;

class User {
  static create(email, password, name, avatarUrl, countryCode, phoneNumber) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.get(query, [email], (err, row) => {
        if (err) {
          reject(new Error('Error registering user'));
        } else if (row) {
          // Email already exists, return error
          reject(new Error('Email address already exists'));
        } else {
          // Email does not exist, insert new user
          bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
              reject(new Error('Error registering user with password salting' + err));
            } else {
              const insertQuery = 'INSERT INTO users (email, password, name, avatar_url, countrycode, phonenumber) VALUES (?, ?, ?, ?, ?, ?)';
              db.run(insertQuery, [email, hash, name, avatarUrl, countryCode, phoneNumber], function (err) {
                if (err) {
                  reject(new Error('Error registering user'));
                } else {
                  resolve(this.lastID);
                }
              });
            }
          });
        }
      });
    });
  }

  static update(email, name, avatarUrl, countrycode, phoneNumber, id) {
    return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE users SET email = ?, name = ?, avatar_url = ?, countrycode = ?, phonenumber = ? WHERE id = ?';
      db.run(updateQuery, [email, name, avatarUrl, countrycode, phoneNumber, id], function (err) {
        if (err) {
          reject(new Error('Error updating user'));
        } else {
          const selectQuery = 'SELECT email,name,avatar_url,countrycode,phonenumber FROM users WHERE id = ?';
          db.get(selectQuery, [id], (err, row) => {
            if (err) {
              reject(new Error('Error retrieving updated user data'));
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  }


  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, email, name, avatar_url, countrycode, phonenumber FROM users WHERE id = ?`;
      db.get(query, [id], function (err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ?`;
      db.get(query, [email], function (err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static userpasswordrest(id, password, newpassword) {
    // Verify the new password with the old password for the given ID
    db.get('SELECT password FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        throw err;
      }
      if (!row) {
        throw new Error(`User with ID ${id} not found`);
      }

      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          throw err;
        }
        if (!result) {
          throw new Error('Password mismatch');
        }

        // Hash the new password and update the user record in the database
        bcrypt.hash(newpassword, saltRounds, (err, hash) => {
          if (err) {
            throw err;
          }

          db.run('UPDATE users SET password = ? WHERE id = ?', [hash, id], (err) => {
            if (err) {
              throw err;
            }
            console.log(`Password for user with ID ${id} has been updated`);
          });
        });
      });
    });
  }

}

module.exports = User;
