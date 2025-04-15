const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost:27017/cylsense', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const weightSchema = new mongoose.Schema({
  weight: Number,
  timestamp: { type: Date, default: Date.now },
});

const Weight = mongoose.model('Weight', weightSchema);

app.use(cors());
app.use(express.json());

app.post('/api/weight', async (req, res) => {
  try {
    const { weight } = req.body;
    const newEntry = new Weight({ weight });
    await newEntry.save();
    res.status(201).json({ message: 'Weight saved', data: newEntry });
  } catch (error) {
    res.status(500).json({ error: 'Error saving weight' });
  }
});

app.get('/api/weight', async (req, res) => {
  const weights = await Weight.find().sort({ timestamp: -1 }).limit(10);
  res.json(weights);
});

app.listen(3000, () => console.log('Server running on port 3000'));
