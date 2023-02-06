const mongoose = require('mongoose');

const AwardSchema = new mongoose.Schema({
  type: {
    type: String,
    require: true,
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

module.exports = AwardModel = mongoose.model('awards', AwardSchema);