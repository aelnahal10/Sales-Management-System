require('dotenv').config();
const express = require('express');
const router = express.Router();

const validateToken = require('../../middleware/validateToken');



const userControllers = require('./controllers');

// Sign up route
router.post('/signup', userControllers.signUp);

// Login route
router.post('/login', userControllers.login);

// Logout route
router.post('/logout', validateToken, userControllers.logout);

// Get current user profile route
router.get('/profile/:Id', validateToken, userControllers.getCurrentUserProfile);

// Update user profile route
router.put('/profile', validateToken, userControllers.updateUserProfile);

// (Optional) Delete user account - use with caution!
router.delete('/profile', validateToken, userControllers.deleteUserProfile);

module.exports = router;
