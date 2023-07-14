const User = require('../models/User');
const authService = require('../services/authService');
const passwordUtils = require('../utils/passwordUtils');


exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = passwordUtils.hashPassword(password);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    
    const accessToken = authService.generateAccessToken(user);
    res.json({ email: user.email, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if(!user){
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const doesPasswordMatch = await authService.comparePasswords(password, user.password);
 

    if (doesPasswordMatch ) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = authService.generateAccessToken(user);
    res.json({ email: user.email, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
