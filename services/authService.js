const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET_KEY;

exports.generateAccessToken = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, secretKey, { expiresIn: '1d' });
};

exports.comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};
