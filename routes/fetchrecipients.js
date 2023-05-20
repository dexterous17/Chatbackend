const express = require('express');
const router = express.Router();
const { authenticaterequest } = require('../middleware/passport');
const Recipientlist = require('../models/recipientlist');

router.post('/', authenticaterequest, async (req, res) => {
    const data = await Recipientlist.getRecipientlist(req.user.id)
    res.json(data);
});

module.exports = router;
