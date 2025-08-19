const orderModel = require('../models/orderModel');

exports.placeOrder = async (req, res) => {
  try {
    const { shippingInfo, cart, paymentMethod, total } = req.body;
    const userId = req.user._id;
    const items = cart.map(item => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    }));
    const order = await orderModel.create({
      user: userId,
      items,
      shippingInfo,
      paymentMethod,
      total
    });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Order placement failed" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderModel.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};