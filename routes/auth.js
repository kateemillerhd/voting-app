const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.send('Login page placeholder');
});

module.exports = router;