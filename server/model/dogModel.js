const mongoose = require("mongoose");
const dogSchema = new mongoose.Schema({
  breed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "breed",
    required: true,
  },
  image: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
});
const dogModel = mongoose.model("dog", dogSchema);
module.exports = dogModel;
