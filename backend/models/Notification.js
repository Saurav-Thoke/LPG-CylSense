const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  token: { type: String },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String }, // 'leak', 'low', etc.
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
