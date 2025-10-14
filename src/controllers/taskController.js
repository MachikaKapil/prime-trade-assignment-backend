const { db } = require('../models/taskModel');
const { body, validationResult } = require('express-validator');


exports.createValidators = [
body('title').isLength({ min: 1 }).withMessage('Title required'),
body('status').optional().isIn(['pending', 'in-progress', 'done']).withMessage('Invalid status')
];


exports.createTask = async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
try {
const { title, description, status } = req.body;
const [id] = await db('tasks').insert({ user_id: req.user.id, title, description, status });
const task = await db('tasks').where({ id }).first();
res.status(201).json({ task });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};

exports.getTasks = async (req, res) => {
try {
const { q, status } = req.query;
let query = db('tasks').where({ user_id: req.user.id });
if (q) query = query.andWhere('title', 'like', `%${q}%`);
if (status) query = query.andWhere({ status });
const tasks = await query.orderBy('created_at', 'desc');
res.json({ tasks });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};


exports.getTask = async (req, res) => {
try {
const task = await db('tasks').where({ id: req.params.id, user_id: req.user.id }).first();
if (!task) return res.status(404).json({ message: 'Task not found' });
res.json({ task });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};

exports.updateValidators = [
body('title').optional().isLength({ min: 1 }).withMessage('Title required'),
body('status').optional().isIn(['pending', 'in-progress', 'done']).withMessage('Invalid status')
];


exports.updateTask = async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
try {
const { title, description, status } = req.body;
await db('tasks').where({ id: req.params.id, user_id: req.user.id }).update({ title, description, status, updated_at: new Date() });
const task = await db('tasks').where({ id: req.params.id }).first();
res.json({ task });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};


exports.deleteTask = async (req, res) => {
try {
await db('tasks').where({ id: req.params.id, user_id: req.user.id }).del();
res.json({ message: 'Deleted' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};