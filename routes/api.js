const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

router.get('/polls', async (req, res) => {
  const polls = await Poll.find({}, 'question _id');
  res.json(polls);
});

router.get('/test', (req, res) => {
  res.json({ message: "API is working" });
});

module.exports = router;