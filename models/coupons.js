const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  percentageDisc: {
    type: Number
  },
  amountDisc: {
    type: Number
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = CouponModel = mongoose.model('coupons', CouponSchema);