// backend/src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');

// Get all tasks
router.get('/', getAllTasks);

// Get task by ID
router.get('/:id', getTaskById);

// Create new task
router.post('/', createTask);

// Update existing task
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
