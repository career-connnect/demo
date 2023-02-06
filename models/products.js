const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'categories',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = ProductModel = mongoose.model('products', ProductSchema);