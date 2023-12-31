const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decodedToken;
    next();
  });
};
