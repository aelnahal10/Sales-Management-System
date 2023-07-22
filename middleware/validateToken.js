const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
    // Get the token from the cookie
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token with our secret key
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the decoded payload to request object if further information from token is needed
        req.user = decodedPayload;

        next();  // Proceed to the next middleware or route handler
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = validateToken;
