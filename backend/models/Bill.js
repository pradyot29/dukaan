const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  serialNo: { type: String, required: true },
  date: { type: Date, default: Date.now },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  items: [
    {
      itemName: String,
      quantity: Number,
      price: Number,
      quality: String,
      description: String
    }
  ],
  totalAmount: Number,
  totalAmountWithoutTax: Number,
  taxAmount: Number,
  transactionType: { type: String, enum: ["Cash", "Banking"] },
  signature: String
});

module.exports = mongoose.model("Bill", billSchema);
