const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionType: { type: String, enum: ["Cash", "Banking"], required: true },
  totalAmount: Number,
  totalAmountWithoutTax: Number,
  taxAmount: Number,
  date: { type: Date, default: Date.now },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" }
});

module.exports = mongoose.model("Transaction", transactionSchema);
