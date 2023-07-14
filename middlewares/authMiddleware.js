const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

exports.authenticateUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  
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

exports.checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};
