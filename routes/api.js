const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "You must be logged in to do that." });
}

router.get("/polls", async (req, res) => {
  const polls = await Poll.find({}, "question _id");
  res.json(polls);
});

router.post("/polls", ensureLoggedIn, async (req, res) => {
  const { question, options } = req.body;

  const poll = new Poll({
    question,
    options: options.map((text) => ({ text })),
    ownerId: req.user._id,
  });

  await poll.save();
  res.json(poll);
});

router.get("/polls/:id", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  res.json(poll);
});

router.post("/polls/:id/vote", async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ error: "Poll not found" });

  if (
    typeof optionIndex !== "number" ||
    optionIndex < 0 ||
    optionIndex >= poll.options.length
  ) {
    return res.status(400).json({ error: "Invalid option index" });
  }

  const option = poll.options[optionIndex];
  option.votes = (option.votes || 0) + 1;

  await poll.save();
  res.json(poll);

  res.json({ message: "Vote recorded" });
});

router.get("/mypolls", ensureLoggedIn, async (req, res) => {
  const polls = await Poll.find({ ownerId: req.user._id }, "question _id");
  res.json(polls);
});

router.delete("/polls/:id", ensureLoggedIn, async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) return res.status(404).json({ error: "Poll not found" });
  if (!poll.ownerId.equals(req.user._id)) {
    return res.status(403).json({ error: "You do not own this poll" });
  }

  await poll.deleteOne();
  res.json({ message: "Poll deleted" });
});
module.exports = router;
