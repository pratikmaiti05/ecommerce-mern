const express = require('express');
const { placeOrder, getUserOrders } = require('../controllers/orderController');
const { isLoggedin } = require('../middlewares/isLoggedin');
const router = express.Router();

router.post('/place-order', isLoggedin, placeOrder);
router.get('/getOrders', isLoggedin, getUserOrders);

module.exports = router;