// controllers.js in the /users directory
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../../database'); 
const db = require('../../database'); 

require('dotenv').config();

const { expiresInToMilliseconds } = require('../../utils/tokenHelper');



exports.signUp = async (req, res, next) => {
    const {
        first_name,
        last_name,
        email,
        password,
        postcode,
        address,
        phone_number
    } = req.body;
 
   

    // Validation: Check if all required fields are provided
    if (!first_name || !email || !password || !last_name || !postcode || !address || !phone_number) {
        return res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    }

    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Use Sequelize model method to create a new user
        await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword,
            postcode: postcode,
            address: address,
            phone_number: phone_number
        });
        

        // Return a meaningful response
        res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
        // Handle unique constraint error (e.g., email already exists)
        if (error instanceof db.Sequelize.UniqueConstraintError) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Log the error (for debugging and monitoring purposes)
        console.error("Database error during signup:", error);

        // Return a generic error message
        res.status(500).json({ error: 'Failed to sign up. Please try again later.' });
    }
};




// Handle user login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: 'Both email and password are required.' });
    }

    try {
        // Use Sequelize model method to find a user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokenPayload = { userId: user.id, email: user.email };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
        const maxAge = expiresInToMilliseconds(process.env.TOKEN_EXPIRATION);

        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: maxAge,
            // Other cookie options like 'secure: true' if using HTTPS
        });

        res.status(200).json({ message: 'Logged in successfully', token });

    } catch (error) {
        // Log the error for debugging and monitoring
        console.error("Error during login:", error);

        // Return a generic error message
        res.status(500).json({ error: 'Failed to login. Please try again later.' });
    }
};



// Handle user logout
exports.logout = (req, res, next) => {
    res.send('This is the logout controller');
};

exports.getCurrentUserProfile = async (req, res, next) => {
    const userId = req.params.Id;

    // Input Validation
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        // Use Sequelize's findByPk method to get a user by primary key (ID)
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'id'] },  // Fetch all columns except password,  // Just an example, modify as needed
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);

    } catch (error) {
        // Log the error for debugging and monitoring
        console.error("Error fetching user profile:", error);

        // Return a generic error message
        res.status(500).json({ error: 'Failed to retrieve user profile. Please try again later.' });
    }
};


// Update current user's profile

exports.updateUserProfile = async (req, res, next) => {
    const userEmail = req.body.email; // assuming you're sending the user's email in the request body
    const { first_name, newEmail, newPassword } = req.body; // assuming the user can change their name, email, and password

    // Validate inputs (just a simple check for this example, but consider using a library like 'validator' or 'joi' for robust validation)
    if (!userEmail || !first_name || !newEmail || !newPassword) {
        return res.status(400).json({ error: 'Incomplete request data' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Use Sequelize's update method
        const [updatedRowsCount] = await User.update({
            name: name,
            email: newEmail,
            password: hashedPassword
        }, {
            where: {
                email: userEmail
            }
        });

        // Check if update was successful
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.send('User profile updated successfully.');
    } catch (error) {
        console.error('Error updating user:', error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Delete current user's profile (use with caution!)
exports.deleteUserProfile = async (req, res, next) => {
    const userEmail = req.body.email; 

    // Validate inputs (simple check for this example, but you might want to use a library like 'validator' or 'joi' for comprehensive validation)
    if (!userEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Use Sequelize's destroy method
        const deletedRowsCount = await User.destroy({
            where: {
                email: userEmail
            }
        });

        // Check if any record was deleted
        if (deletedRowsCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.send('User profile deleted successfully.');
    } catch (error) {
        console.error('Error deleting user:', error); // For debugging purposes
        return res.status(500).json({ error: 'Internal server error' });
    }
};

