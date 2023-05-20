const express = require('express');
const { jwtAuthMiddleware } = require('../../middleware/passport');
const User = require('../../models/user');
const router = express.Router();

router.get('/', jwtAuthMiddleware, async (req, res) => {
    console.log(req.user)
    const data =  await User.findById(req.user.id)
    res.json(data)
});

module.exports = router;
