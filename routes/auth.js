const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require9'../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ error: 'Username taken' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashed });

  await newUser.save();
  req.login(newUser, (err) => {
    if (err) return res.status(500).json({ error: 'Login after register failed' });
    res.json({ user: { username: newUser.username } });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ user: { username: req.user.username } });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user.username });
  } else {
    res.json({ user: null });
  }
});

module.exports = router;