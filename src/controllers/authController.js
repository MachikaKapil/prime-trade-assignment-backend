const { db } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();


const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

exports.registerValidators = [
body('name').isLength({ min: 2 }).withMessage('Name required'),
body('email').isEmail().withMessage('Valid email required'),
body('password').isLength({ min: 6 }).withMessage('Password min length 6')
];


exports.register = async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
try {
const { name, email, password } = req.body;
const existing = await db('users').where({ email }).first();
if (existing) return res.status(409).json({ message: 'Email already registered' });
const hash = await bcrypt.hash(password, SALT_ROUNDS);
const [id] = await db('users').insert({ name, email, password: hash });
const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
return res.status(201).json({ token, user: { id, name, email } });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};

exports.loginValidators = [
body('email').isEmail().withMessage('Valid email required'),
body('password').exists().withMessage('Password required')
];


exports.login = async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
try {
const { email, password } = req.body;
const user = await db('users').where({ email }).first();
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};

exports.getProfile = async (req, res) => {
try {
const user = await db('users').where({ id: req.user.id }).first();
if (!user) return res.status(404).json({ message: 'User not found' });
delete user.password;
res.json({ user });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};


exports.updateProfileValidators = [
body('name').optional().isLength({ min: 2 }).withMessage('Name too short')
];


exports.updateProfile = async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
try {
const { name } = req.body;
await db('users').where({ id: req.user.id }).update({ name, updated_at: new Date() });
const user = await db('users').where({ id: req.user.id }).first();
delete user.password;
res.json({ user });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};