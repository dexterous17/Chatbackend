const Message = require('../models/message');
const Socket = require('../models/socket')
const { authenticate } = require('../middleware/passport');

const socketAPI = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });
    io.use(authenticate).on('connect', async socket => {

        console.log('User connected:', socket.id);

        // Adds User id along with socket id into the database
        Socket.add_socket(socket.request.user.id, socket.id).catch((error) => {
            console.error(error)
        })

        // When a user sends a message
        socket.on('send_message', data => {
            const { sender_id, recipient_id, content } = data;
            console.log(data)
            // Save the message to the database

            Message.create(sender_id, recipient_id, content)
                .then((data) => {
                    socket.emit('receive_message', { ...data });
                    messagestored = data;
                })
                .catch((error) => {
                    console.error(error);
                }).finally(() => {
                    Socket.findsocket_id(recipient_id)
                        .then((data) => {
                            if (!data || !data.socket_id) {
                                console.log('Recipient not online');
                            } else {
                                const recipientSocket = io.sockets.sockets.get(data.socket_id);
                                if (recipientSocket) {
                                    recipientSocket.emit('receive_message', { ...messagestored });
                                    console.log(`Message sent from ${senderid} to ${recipientid}.`);
                                } else {
                                    console.error('Recipient socket not found');
                                }
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
        });


        // When a user disconnects
        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);
            // Removes socket id from the database of the User
            await Socket.remove_socket(socket.id);
        });
    });
}

module.exports = socketAPI;
