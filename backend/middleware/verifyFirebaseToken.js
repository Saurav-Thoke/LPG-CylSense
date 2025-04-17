const admin = require('../firebase');  // Import Firebase Admin

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Store user information in request object
    next(); // Call next middleware or route handler
  } catch (error) {
    res.status(401).send('Unauthorized: Invalid token');
  }
};

module.exports = { verifyFirebaseToken };
