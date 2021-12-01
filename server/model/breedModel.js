const mongoose = require("mongoose");
const breedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
});
const breedModel = mongoose.model("breed", breedSchema);
module.exports = breedModel;
