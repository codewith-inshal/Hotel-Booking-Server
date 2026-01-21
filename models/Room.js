const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: String,
  desc: String,
  price: Number,
  rating: Number,
  review: String,
  image: String
});

module.exports = mongoose.model("Room", roomSchema);
