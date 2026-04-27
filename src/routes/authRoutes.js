const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET = 'supersecretkey'; // later move to .env

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    role: role || 'player'
  });

  res.status(201).json({ message: 'User created' });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;