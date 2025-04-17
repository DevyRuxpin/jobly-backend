const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { User, Company, Job, Application } = require('../models');

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
router.post('/auth/register', [
  body('username').isLength({ min: 3, max: 30 }),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/auth/token', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  
  if (user) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Company routes
router.get('/companies', async (req, res) => {
  const { name } = req.query;
  const where = name ? { name: { [Op.iLike]: `%${name}%` } } : {};
  
  const companies = await Company.findAll({
    where,
    include: [{ model: Job, as: 'jobs' }],
  });
  res.json({ companies });
});

router.get('/companies/:handle', async (req, res) => {
  const company = await Company.findOne({
    where: { handle: req.params.handle },
    include: [{ model: Job, as: 'jobs' }],
  });
  
  if (company) {
    res.json({ company });
  } else {
    res.status(404).json({ error: 'Company not found' });
  }
});

// Job routes
router.get('/jobs', async (req, res) => {
  const { title } = req.query;
  const where = title ? { title: { [Op.iLike]: `%${title}%` } } : {};
  
  const jobs = await Job.findAll({
    where,
    include: [{ model: Company, as: 'company' }],
  });
  res.json({ jobs });
});

router.get('/jobs/:id', async (req, res) => {
  const job = await Job.findByPk(req.params.id, {
    include: [{ model: Company, as: 'company' }],
  });
  
  if (job) {
    res.json({ job });
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

// User routes
router.get('/users/:username', auth, async (req, res) => {
  const user = await User.findOne({
    where: { username: req.params.username },
    include: [{ model: Job, through: Application }],
  });
  
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.patch('/users/:username', auth, async (req, res) => {
  if (req.user.username !== req.params.username && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const user = await User.findOne({ where: { username: req.params.username } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await user.update(req.body);
  res.json({ user });
});

// Application routes
router.post('/users/:username/jobs/:id', auth, async (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await Application.create({
      userId: req.user.id,
      jobId: req.params.id,
    });
    res.json({ applied: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 