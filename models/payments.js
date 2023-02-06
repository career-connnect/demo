const mongoose = require('mongoose');

const PaymentsSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  coupon: {
    type: String
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'products',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  reference: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  commissionPercentage: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = PaymentsModel = mongoose.model('payments', PaymentsSchema);