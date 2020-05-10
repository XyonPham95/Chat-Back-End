const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    toLowerCase: true,
  },

  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
  },
  token: String,
});

module.exports = mongoose.model("User", schema);
