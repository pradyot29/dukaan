const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  address: String,
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }
});

module.exports = mongoose.model("Customer", customerSchema);
