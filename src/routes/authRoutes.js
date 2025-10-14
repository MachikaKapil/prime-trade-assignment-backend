const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', auth.registerValidators, auth.register);
router.post('/login', auth.loginValidators, auth.login);
router.get('/profile', authMiddleware, auth.getProfile);
router.put('/profile', authMiddleware, auth.updateProfileValidators, auth.updateProfile);


module.exports = router;