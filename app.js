const express = require('express');
const userRoutes = require('./routes/users'); // Assuming your entry point is at the root directory
const app = express();

// Middlewares
app.use(express.json()); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

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

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
