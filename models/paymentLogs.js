const mongoose = require('mongoose');

const PaymentLogsSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = PaymentLogsModel = mongoose.model('paymentlogs', PaymentLogsSchema);