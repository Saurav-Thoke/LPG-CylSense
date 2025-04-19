const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');

// GET user info
router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = await admin.auth().verifyIdToken(token);
  const user = await User.findOne({ uid: decoded.uid });
  res.json(user);
});

// UPDATE user info
router.put("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = await admin.auth().verifyIdToken(token);
  const { name, phone, address } = req.body;

  const user = await User.findOneAndUpdate(
    { uid: decoded.uid },
    { $set: { ...(name && { name }), ...(phone && { phone }), ...(address && { address }) } },
    { new: true }
  );

  res.json(user);
});

module.exports = router;
