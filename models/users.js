const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  reference: {
    type: mongoose.Types.ObjectId
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'USER', 'DISTRIBUTOR'],
    default: 'USER'
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  forgotTime: {
    type: Date
  },
  isGreen: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = UserModel = mongoose.model('users', UserSchema);