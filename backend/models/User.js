const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  address: { type: String }, // Add this line
});

module.exports = mongoose.model('User', userSchema);
