const express = require('express');
const { placeOrder, getUserOrders, allOrders, orderStatus } = require('../controllers/orderController');
const { isLoggedin } = require('../middlewares/isLoggedin');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

router.post('/place-order', isLoggedin, placeOrder);
router.get('/getOrders', isLoggedin, getUserOrders);
router.get('/allOrders', isLoggedin, isAdmin,allOrders);
router.post('/orderStatus/:id', isLoggedin, isAdmin,orderStatus);
module.exports = router;