const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  address: String
});

module.exports = mongoose.model("Shop", shopSchema);
