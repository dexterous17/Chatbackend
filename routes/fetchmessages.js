const express = require('express');
const { authenticaterequest } = require('../middleware/passport');
const Message = require('../models/message');
const router = express.Router();


router.post('/', authenticaterequest, async (req, res) => {
    const message = await Message.findall(req.body.data.sender_id, req.body.data.recipient_id)
    res.json(message)
});

module.exports = router;
