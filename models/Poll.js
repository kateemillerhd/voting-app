const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  question: String,
  options: [optionSchema],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  voters: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Poll", pollSchema);
