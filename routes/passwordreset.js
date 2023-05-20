const express = require('express');
const { authenticaterequest } = require('../middleware/passport');
const User = require('./../models/user');
const router = express.Router();

router.post('/', authenticaterequest, async (req, res) => {
    try {
        if (req.body.values.newPassword !== req.body.values.confirmPassword) {
            throw new Error('New password and confirm password are nto matching');
        }

        await User.userpasswordrest(req.user.id, req.body.values.currentPassword, req.body.values.newPassword);

        res.status(200).send({ message: 'Password has been updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
