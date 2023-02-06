const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["IMAGE", "VIDEO"],
    require: true,
    default: "IMAGE"
  },
  galleryType: {
    type: String,
    require: true
  },
  source: {
    type: String,
    require: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = GalleryModel = mongoose.model('galleries', GallerySchema);