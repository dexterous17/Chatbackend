const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { upload } = require('../middleware/middleware');
const fs = require('fs');

router.post('/', upload.single('avatar_url'), async (req, res) => {
    console.log(req.body);
    try {
        const { email, password, confirmPassword, name, countryCode, phoneNumber } = req.body;

        if (password !== confirmPassword) {
            res.status(500).send('Password and confirm password is not matching');
        }

        let avatarUrl = null;
        if (req.file) {
            avatarUrl = req.file.filename;
        }

        const user = await User.create(
            email,
            password,
            name,
            avatarUrl,
            countryCode,
            phoneNumber,
        );

        res.status(200).json(user);
    } catch (error) {
        console.error('Error:', error);
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Error removing file:', error);
            }
        }
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
