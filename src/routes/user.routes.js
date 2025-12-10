const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateRequest = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { registerSchema, loginSchema } = require('../validations/user.validation');

// Public routes
router.post('/register', validateRequest(registerSchema), userController.register);
router.post('/login', validateRequest(loginSchema), userController.login);

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;