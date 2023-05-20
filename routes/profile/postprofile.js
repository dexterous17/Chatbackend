const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../../middleware/passport');
const { upload } = require('../../middleware/middleware');
const User = require('../../models/user');

router.post('/', upload.single('avatar_url'), jwtAuthMiddleware, async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  let avatarUrl = null;
  if (req.file) {
    avatarUrl = req.file.filename;
  }
  const { name, email, phoneNumber, countrycode } = req.body;
  const data = await User.update(email, name, avatarUrl, countrycode, phoneNumber, req.user.id)
  console.log(data)
  res.json(data);
});

module.exports = router;
