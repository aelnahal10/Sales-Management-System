const express = require('express');
const router = express.Router();

const userControllers = require('./controllers');

// Sign up route
router.post('/signup', userControllers.signUp);

// Login route
router.post('/login', userControllers.login);

// Logout route
router.post('/logout', userControllers.logout);

// Get current user profile route
router.get('/profile/:Id', userControllers.getCurrentUserProfile);

// Update user profile route
router.put('/profile', userControllers.updateUserProfile);

// (Optional) Delete user account - use with caution!
router.delete('/profile', userControllers.deleteUserProfile);

module.exports = router;
