const db = require('./db');

class Socket {
    static add_socket(id, socket_id) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users SET socket_id = ? WHERE id = ?;`;
            db.get(query, [socket_id, id], function (err, row) {
                if (err) {
                    reject(err)
                } else {
                    resolve("Socket has been updated")
                }
            })
        })
    }

    static remove_socket(socket_id) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users SET socket_id = ? WHERE socket_id = ?;`;
            db.get(query, [null, socket_id], function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve("Socket has been updated")
                }
            })
        })
    }

    static findsocket_id(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT socket_id FROM users WHERE id = ?;`;
            db.get(query, [id], function (err, row) {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
}

module.exports = Socket;