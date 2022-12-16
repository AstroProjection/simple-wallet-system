const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Wallet", walletSchema);
