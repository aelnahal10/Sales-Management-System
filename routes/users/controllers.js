// controllers.js in the /users directory
const jwt = require('jsonwebtoken');
const dbPool = require('../../database');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { expiresInToMilliseconds } = require('../../utils/tokenHelper');



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

            const tokenPayload = { userId: user.id, email: user.email }; 
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });

            const maxAge = expiresInToMilliseconds(process.env.TOKEN_EXPIRATION);

            res.cookie('auth_token', token, {
                httpOnly: true,
                maxAge: maxAge,
                // Other cookie options like 'secure: true' if using HTTPS
            });

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

// Add a new product
exports.addProduct = (req, res) => {
    const { name, description, price, stockQuantity } = req.body;  // add other fields as necessary

    const query = 'INSERT INTO products (name, description, price, stockQuantity) VALUES (?, ?, ?, ?)';
    dbPool.query(query, [name, description, price, stockQuantity], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during product addition' });
        }
        res.send('Product added successfully');
    });
};

// Update product details
exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, description, price, stockQuantity } = req.body;  // and other fields

    const query = 'UPDATE products SET name = ?, description = ?, price = ?, stockQuantity = ? WHERE id = ?';
    dbPool.query(query, [name, description, price, stockQuantity, productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during product update' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.send('Product updated successfully');
    });
};

// Delete a product
exports.deleteProduct = (req, res) => {
    const productId = req.params.id;

    const query = 'DELETE FROM products WHERE id = ?';
    dbPool.query(query, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during product deletion' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.send('Product deleted successfully');
    });
};

// Search for products
exports.searchProducts = (req, res) => {
    const keyword = req.query.keyword;
    const query = 'SELECT * FROM products WHERE name LIKE ?';
    dbPool.query(query, [`%${keyword}%`], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during product search' });
        }
        res.json(results);
    });
};

// Filter and Sort products (as a basic example, let's filter by category and sort by price)
exports.filterAndSortProducts = (req, res) => {
    const category = req.query.category;
    const sort = req.query.sort;  // e.g., 'price' or '-price' for descending

    let query = 'SELECT * FROM products';
    const queryParams = [];

    if (category) {
        query += ' WHERE category = ?';
        queryParams.push(category);
    }

    if (sort) {
        const order = sort.startsWith('-') ? 'DESC' : 'ASC';
        const column = sort.startsWith('-') ? sort.slice(1) : sort;
        query += ` ORDER BY ${column} ${order}`;
    }

    dbPool.query(query, queryParams, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during filtering and sorting' });
        }
        res.json(results);
    });
};


// Place an order
exports.placeOrder = (req, res) => {
    const { userId, productId, quantity } = req.body;  // assuming a simple order schema, expand as required

    const query = 'INSERT INTO orders (userId, productId, quantity, status) VALUES (?, ?, ?, "processing")';
    dbPool.query(query, [userId, productId, quantity], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during order placement' });
        }
        res.send('Order placed successfully');
    });
};

// Update order status
exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    dbPool.query(query, [status, orderId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error updating order status' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.send('Order status updated successfully');
    });
};

// View order history for a specific user
exports.viewOrderHistory = (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT * FROM orders WHERE userId = ?';
    dbPool.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error fetching order history' });
        }
        res.json(results);
    });
};

exports.initiatePasswordReset = (req, res) => {
    const { email } = req.body;

    // Logic to initiate password reset (like sending a reset token/link to email)

    res.send('Password reset initiated. Please check your email.');
};

exports.completePasswordReset = (req, res) => {
    const { resetToken, newPassword } = req.body;

    // Logic to verify resetToken and update the user's password

    res.send('Password reset successfully.');
};

// Update user profile
exports.updateUserProfile = (req, res) => {
    const { userId, name, email } = req.body; // assuming basic profile details

    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    dbPool.query(query, [name, email, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error updating user profile' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send('Profile updated successfully');
    });
};

// Password reset
exports.passwordReset = (req, res) => {
    const { userId, newPassword } = req.body; // potentially you'd use a token system in a real-world scenario

    const query = 'UPDATE users SET password = ? WHERE id = ?';
    dbPool.query(query, [newPassword, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error resetting password' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send('Password reset successfully');
    });
};

// Add a new address for a user
exports.addAddress = (req, res) => {
    const { userId, address } = req.body; 

    const query = 'INSERT INTO addresses (userId, address) VALUES (?, ?)';
    dbPool.query(query, [userId, address], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error adding new address' });
        }
        res.send('Address added successfully');
    });
};

// Update an existing address
exports.updateAddress = (req, res) => {
    const addressId = req.params.addressId;
    const { address } = req.body;

    const query = 'UPDATE addresses SET address = ? WHERE id = ?';
    dbPool.query(query, [address, addressId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error updating address' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.send('Address updated successfully');
    });
};

// Delete an address
exports.deleteAddress = (req, res) => {
    const addressId = req.params.addressId;

    const query = 'DELETE FROM addresses WHERE id = ?';
    dbPool.query(query, [addressId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error deleting address' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.send('Address deleted successfully');
    });
};

// Checkout
exports.checkout = async (req, res) => {
    const userId = req.body.userId;

    try {
        // Step 1: Lock cart items to prevent double selling
        const lockCartQuery = 'SELECT * FROM cart WHERE userId = ? FOR UPDATE'; // This assumes you're using a DB that supports row-level locking
        const lockedCartItems = await dbPool.promise().query(lockCartQuery, [userId]);

        if (lockedCartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Step 2: Charge the user using a payment gateway (pseudo-code)
        const isPaymentSuccessful = await paymentGateway.chargeUser(userId, lockedCartItems); // This is a mock function; you'd need to integrate with a real payment gateway

        if (!isPaymentSuccessful) {
            return res.status(400).json({ error: 'Payment failed' });
        }

        // Step 3: Upon successful payment, move items from cart to order table
        const moveItemsToOrderQuery = 'CALL moveItemsToOrderProcedure(?)'; // This could be a stored procedure that moves the items
        await dbPool.promise().query(moveItemsToOrderQuery, [userId]);

        // Step 4: Clear the cart
        const clearCartQuery = 'DELETE FROM cart WHERE userId = ?';
        await dbPool.promise().query(clearCartQuery, [userId]);

        res.send('Checkout successful');

    } catch (error) {

        // Step 5: Handle cases where payment fails, stock changes during payment, etc.
        if (error.message === 'STOCK_CHANGED') {
            return res.status(400).json({ error: 'One or more items in your cart changed in stock during the checkout process. Please try again.' });
        }

        // Generic error handling
        return res.status(500).json({ error: 'Database or payment error during checkout' });
    }
};

