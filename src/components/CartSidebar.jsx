import React, { useContext } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, totalEstimatedPrice } = useContext(CartContext);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-mintwhite">
          <h2 className="text-xl font-bold text-deepgreen flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Your Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Your cart is empty.</div>
          ) : (
            cartItems.map(item => (
              <div key={item.productId} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-50" />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-deepgreen line-clamp-1">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{item.unitSize}</div>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="font-bold text-vibrantgreen">₹{item.price * item.quantity}</div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600 font-medium">Estimated Total</span>
            <span className="text-2xl font-extrabold text-deepgreen">₹{totalEstimatedPrice}</span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
            className="w-full bg-vibrantgreen text-white font-bold py-4 rounded-xl hover:bg-deepgreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-100"
          >
            Request a Quote
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
