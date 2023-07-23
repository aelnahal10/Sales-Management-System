const express = require('express');
const userRoutes = require('./routes/users');
const db = require('./database');  // Import the database configuration
const cookieParser = require('cookie-parser');

// Load environment variables (assuming you're using dotenv)
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// User routes
app.use('/users', userRoutes);

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Set port
const port = process.env.PORT || 3000;

// Connect to the database and start the server
db.sequelize.sync()
    .then(() => {
        app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
