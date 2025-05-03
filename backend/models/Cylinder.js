const mongoose = require('mongoose');

const CylinderSchema = new mongoose.Schema({
  uid: {
    type: String,  
    required: true
  },
  cylinderWeight: {
    type: Number,
    required: true
  },
  trackingDate: {
    type: String,
    default: Date.now
  }
});

module.exports = mongoose.model('Cylinder', CylinderSchema);
