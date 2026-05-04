import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Truck, CheckCircle, Banknote } from 'lucide-react';

const Checkout = () => {
  const { cartItems, totalEstimatedPrice, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({ customerName: '', phone: '', shippingAddress: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (success) {
    return (
      <div className="min-h-screen bg-mintwhite flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-green-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-vibrantgreen" />
          </div>
          <h2 className="text-3xl font-extrabold text-deepgreen mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-8 font-medium text-lg">
            Our team will call you to confirm delivery.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-vibrantgreen text-white font-bold py-4 px-8 rounded-xl hover:bg-deepgreen transition-colors shadow-lg shadow-green-100 w-full"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-mintwhite flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-deepgreen mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="text-vibrantgreen font-medium hover:underline text-lg">
          Go back to products
        </button>
      </div>
    );
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        ...formData,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/')} className="text-vibrantgreen font-semibold hover:underline mb-8 flex items-center gap-2">
          &larr; Back to Catalog
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-vibrantgreen flex items-center justify-center text-white shadow-md">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-extrabold text-deepgreen tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Details</h2>
            {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 font-medium">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input required name="customerName" value={formData.customerName} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all" placeholder="0300 1234567" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Complete Delivery Address <span className="text-red-500">*</span></label>
                <textarea required name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} rows="3" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all" placeholder="House/Farm No, Street, Village/City..."></textarea>
              </div>

              {/* COD Notice */}
              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4">
                <Banknote className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 text-lg">Payment Method: Cash on Delivery</h4>
                  <p className="text-blue-700 text-sm mt-1 font-medium">Pay securely when your order arrives at your doorstep.</p>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-vibrantgreen text-white font-bold py-4 rounded-xl hover:bg-deepgreen transition-colors mt-8 shadow-lg shadow-green-100 disabled:opacity-50 text-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Place Order via COD'}
                {!loading && <CheckCircle className="w-5 h-5" />}
              </button>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="bg-mintwhite p-8 rounded-2xl border border-green-100 h-fit sticky top-24 shadow-sm">
            <h2 className="text-2xl font-bold text-deepgreen mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {cartItems.map(item => (
                <div key={item.productId} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                  <div className="flex gap-4 items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                      <div className="text-sm font-medium text-gray-500">{item.unitSize} &times; <span className="text-deepgreen">{item.quantity}</span></div>
                    </div>
                  </div>
                  <div className="font-bold text-deepgreen text-lg">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-green-200 pt-6">
              <div className="flex justify-between items-center text-xl mb-2">
                <span className="font-semibold text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-800">₹{totalEstimatedPrice}</span>
              </div>
              <div className="flex justify-between items-center text-xl mb-6">
                <span className="font-semibold text-gray-600">Delivery</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <span className="font-bold text-gray-800 text-xl">Grand Total</span>
                <span className="text-3xl font-extrabold text-vibrantgreen">₹{totalEstimatedPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
