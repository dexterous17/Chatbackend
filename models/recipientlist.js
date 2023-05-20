const db = require('./db');
class Recipientlist {
    static getRecipientlist(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT id,name,avatar_url FROM users WHERE id != ?;`;
            db.all(query, [id], function (err, row) {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
}

module.exports = Recipientlist;