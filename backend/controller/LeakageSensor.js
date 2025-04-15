const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost:27017/cylsense', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const leakageSchema = new mongoose.Schema({
  gasValue: Number,
  status: String,
  timestamp: { type: Date, default: Date.now },
});

const Leakage = mongoose.model('Leakage', leakageSchema);

app.use(cors());
app.use(express.json());

app.post('/api/leakage', async (req, res) => {
  try {
    const { gasValue } = req.body;
    const status = gasValue > 400 ? "LEAKAGE DETECTED" : "Safe";

    const newLeak = new Leakage({ gasValue, status });
    await newLeak.save();
    res.status(201).json({ message: 'Leakage data saved', data: newLeak });
  } catch (error) {
    res.status(500).json({ error: 'Error saving gas data' });
  }
});

app.get('/api/leakage', async (req, res) => {
  const leaks = await Leakage.find().sort({ timestamp: -1 }).limit(10);
  res.json(leaks);
});

app.listen(3000, () => console.log('LPG backend running on port 3000'));
