const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [
    {
      text: {
        type: String,
        required: true
      },
      votes: {
        type: Number,
        default: 0
      }
    }
  ],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model("Poll", pollSchema);
