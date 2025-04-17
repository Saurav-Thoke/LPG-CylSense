// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');
const User = require('../models/User'); // Your Mongoose model

router.post('/register', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = req.body;

    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email, name });
      await user.save();
    }

    res.status(200).json({ message: 'User authenticated and saved', user });
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
