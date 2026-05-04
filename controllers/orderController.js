import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error while updating order' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customerName, phone, shippingAddress, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      const itemPrice = product.basePricePKR || product.price;
      calculatedTotal += itemPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice // server verified price
      });
    }

    const order = new Order({
      customerName,
      phone,
      shippingAddress,
      items: orderItems,
      totalAmount: calculatedTotal,
      paymentMethod: 'Cash on Delivery'
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};
