const express = require('express');
const router = express.Router();
const Cylinder = require('../models/Cylinder');  // Cylinder Model

// Route to add a new cylinder
router.post('/add', async (req, res) => {
  const { userId, cylinderWeight, status } = req.body;
  
  try {
    const newCylinder = new Cylinder({ userId, cylinderWeight, status });
    await newCylinder.save();
    res.status(200).json({ message: 'Cylinder added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding cylinder', error: err });
  }
});

// Route to get all cylinders for the authenticated user
router.get('/get', async (req, res) => {
  const { userId } = req.query;  // userId comes from frontend
  
  try {
    const cylinders = await Cylinder.find({ userId });
    res.status(200).json({ cylinders });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cylinders', error: err });
  }
});

module.exports = router;
