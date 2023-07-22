// controllers.js in the /users directory
const dbPool = require('../../database');
const bcrypt = require('bcrypt');



exports.signUp = (req, res, next) => {
    const { name, email, password } = req.body;

    // Hash the password with bcrypt
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        dbPool.query(query, [name, email, hashedPassword], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error during signup' });
            }
            res.send('User signed up successfully');
        });
    });
};



// Handle user login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE email = ?';
    dbPool.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during login' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error verifying password' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            //add sessions and auth tokens
            
            //req.session.user = user;
            res.send('Logged in successfully');
        });
    });
};


// Handle user logout
exports.logout = (req, res, next) => {
    res.send('This is the logout controller');
};

// Retrieve current user's profile
exports.getCurrentUserProfile = (req, res, next) => {
    const userId = req.params.Id; 
    console.log(req)
    const query = 'SELECT * FROM users WHERE id = ?';
    dbPool.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error fetching profile' });
        }
        res.json(results[0]); // Return the user profile
    });
};


// Update current user's profile
exports.updateUserProfile = (req, res, next) => {
    const userEmail = req.body.email; // assuming you're sending the user's email in the request body
    const { name, newEmail, newPassword } = req.body; // assuming the user can change their name, email, and password

    // Ideally, validate the input here
    // ...

    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE email = ?';
        dbPool.query(query, [name, newEmail, hashedPassword, userEmail], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error during profile update' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.send('User profile updated successfully.');
        });
    });
};

// Delete current user's profile (use with caution!)
exports.deleteUserProfile = (req, res, next) => {
    const userEmail = req.body.email; // assuming you're sending the user's email in the request body

    // Ideally, validate the input here
    // ...

    const query = 'DELETE FROM users WHERE email = ?';
    dbPool.query(query, [userEmail], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during profile deletion' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send('User profile deleted successfully.');
    });
};
