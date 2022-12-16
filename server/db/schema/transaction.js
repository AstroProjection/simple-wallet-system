const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
  },
  wallet: {
    type: String,
    required: true,
    ref: "Wallet",
  },
});

module.exports = mongoose.model("Transactions", transactionSchema);
