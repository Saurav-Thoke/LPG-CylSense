const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  device: { type: String, required: true },
  weight: { type: Number, required: true },
  gas: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);
module.exports = SensorData;
