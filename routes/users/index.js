require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const app = express()
const cors = require("cors");
app.use(cors());app.use(express.json());
const port = process.env.PORT || 19007

DATABASE_URL='mysql://quuk2dwg7cgsy4xn3pu8:************@aws.connect.psdb.cloud/sms?ssl={"rejectUnauthorized":true}'

const databaseUrl = new URL(process.env.DATABASE_URL);
const connection = mysql.createConnection(process.env.DATABASE_URL)

dbConnection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database with thread number', dbConnection.threadId);
});



const userControllers = require('./controllers');

// Sign up route
router.post('/signup', userControllers.signUp);

// Login route
router.post('/login', userControllers.login);

// Logout route
router.post('/logout', userControllers.logout);

// Get current user profile route
router.get('/profile', userControllers.getCurrentUserProfile);

// Update user profile route
router.put('/profile', userControllers.updateUserProfile);

// (Optional) Delete user account - use with caution!
router.delete('/profile', userControllers.deleteUserProfile);

module.exports = router;
