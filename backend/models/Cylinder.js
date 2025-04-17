const mongoose = require('mongoose');

const CylinderSchema = new mongoose.Schema({
  userId: {
    type: String,  // Firebase user ID
    required: true
  },
  cylinderWeight: {
    type: Number,
    required: true
  },
  status: {
    type: String,  // "full", "empty"
    required: true
  }
});

module.exports = mongoose.model('Cylinder', CylinderSchema);
