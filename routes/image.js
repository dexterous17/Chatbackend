const express = require('express');
const router = express.Router();
const path = require('path');

// Serve uploaded images from the "uploads" folder
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.get('/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error sending file: ${filePath}`, err);
            res.status(err.status).end();
        }
    });
});

module.exports = router;
