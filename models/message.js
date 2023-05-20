const db = require('./db');
class Message {
    static create(sender, recipient, message) {
        console.log(sender, recipient, message)
        return new Promise((resolve, reject) => {
            if (sender && recipient && message) {
                const insertQuery = 'INSERT INTO messages (sender_id, recipient_id, message, utc_timestamp) VALUES (?, ?, ?, datetime(\'now\', \'utc\'))';
                const selectQuery = 'SELECT * FROM messages WHERE id = ?';

                db.run(insertQuery, [sender, recipient, message], function (err) {
                    if (err) {
                        console.error('Error saving message:', err);
                        reject(new Error("Error saving message"));
                    }

                    const messageId = this.lastID;
                    console.log(`Message from ${sender} to ${recipient} saved to database with ID ${messageId}.`);

                    db.get(selectQuery, [messageId], function (err, row) {
                        if (err) {
                            console.error('Error fetching message:', err);
                            reject(new Error("Error fetching message"));
                        }

                        console.log('Inserted data');
                        resolve(row);
                    });
                })
            } else {
                reject(new Error("Message from sender or recipient or message not found"));
            }
        });


    }

    static findall(sender_id, recipient_id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (recipient_id = ? AND sender_id = ?)";
            db.all(query, [sender_id, recipient_id, sender_id, recipient_id],
                (err, row) => {
                    if (err) {
                        console.error('Error retriving messages:', err);
                        reject(new Error("Error retriving messages"));
                    }
                    if (row) {
                        resolve(row)
                    }
                })
        })
    }
}

module.exports = Message;