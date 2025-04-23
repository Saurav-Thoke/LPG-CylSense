const admin = require('firebase-admin');

// Initialize Firebase Admin with your service account credentials
const serviceAccount = require('./firebase-admin.json'); // Replace with your actual Firebase service account JSON file path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = admin;
