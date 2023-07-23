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

// Routes for Profile Management
router.put('/user/profile', userControllers.updateUserProfile);
router.post('/user/password-reset', userControllers.passwordReset);
router.post('/user/address', userControllers.addAddress);
router.put('/user/address/:addressId', userControllers.updateAddress);
router.delete('/user/address/:addressId', userControllers.deleteAddress);

const productControllers = require('./controllers');
// Routes for products
router.post('/product', productControllers.addProduct);
router.put('/product/:id', productControllers.updateProduct);
router.delete('/product/:id', productControllers.deleteProduct);
router.get('/products/search', productControllers.searchProducts);
router.get('/products/filter', productControllers.filterAndSortProducts);

const orderControllers = require('./controllers');
// Routes for orders
router.post('/order', orderControllers.placeOrder);
router.put('/order/:id/status', orderControllers.updateOrderStatus);
router.get('/orders/:userId', orderControllers.viewOrderHistory);



// Routes for Profile Management
router.put('/user/profile', userControllers.updateUserProfile);
router.post('/user/password-reset', userControllers.passwordReset);
router.post('/user/address', userControllers.addAddress);
router.put('/user/address/:addressId', userControllers.updateAddress);
router.delete('/user/address/:addressId', userControllers.deleteAddress);


const cartControllers = require('./controllers');

// Routes for Cart Management
router.post('/user/cart/add', cartControllers.addToCart);
router.put('/user/cart/update/:productId', cartControllers.updateCart);
router.delete('/user/cart/remove/:productId', cartControllers.removeFromCart);
router.post('/user/cart/checkout', cartControllers.checkout);
module.exports = router;
