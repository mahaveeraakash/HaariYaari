import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const toggleExpand = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm">Order ID & Date</th>
              <th className="px-6 py-4 font-semibold text-sm">Customer Details</th>
              <th className="px-6 py-4 font-semibold text-sm">Total Amount</th>
              <th className="px-6 py-4 font-semibold text-sm">Status</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">Loading orders...</td>
              </tr>
            ) : orders.map(order => (
              <React.Fragment key={order._id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 tracking-wider">#{order._id.slice(-6).toUpperCase()}</div>
                    <div className="text-sm text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-sm font-semibold text-gray-600">{order.phone}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-[200px]">{order.shippingAddress}</div>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-deepgreen text-lg">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-sm font-bold rounded-xl px-4 py-2 outline-none border-0 cursor-pointer shadow-sm transition-all ${getStatusColor(order.status)} hover:opacity-80`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleExpand(order._id)}
                      className="text-vibrantgreen hover:text-deepgreen font-bold flex items-center justify-end gap-1 w-full bg-mintwhite px-3 py-2 rounded-lg transition-colors"
                    >
                      {expandedOrders.has(order._id) ? 'Hide' : 'Items'}
                      {expandedOrders.has(order._id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
                {expandedOrders.has(order._id) && (
                  <tr className="bg-gray-50 border-t border-gray-100">
                    <td colSpan="5" className="px-8 py-6">
                      <div className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Order Items:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                            <div>
                              <div className="font-bold text-gray-900">{item.name}</div>
                              <div className="text-sm font-medium text-gray-500 mt-1">Qty: <span className="text-deepgreen font-bold">{item.quantity}</span></div>
                            </div>
                            <div className="font-extrabold text-vibrantgreen text-lg">₹{item.price * item.quantity}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {!loading && orders.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-lg font-medium">
            No orders have been placed yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
