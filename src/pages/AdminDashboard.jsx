import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import AdminOrders from '../components/AdminOrders';
import { LogOut, Plus, Edit, Trash2, Box, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  
  const { logout, admin } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-deepgreen">HaariYaari Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Welcome, {admin?.username}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-6 font-bold text-lg flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'products' ? 'border-vibrantgreen text-deepgreen' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Box className="w-5 h-5" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-6 font-bold text-lg flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-vibrantgreen text-deepgreen' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Orders
          </button>
        </div>

        {activeTab === 'products' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Product Catalog</h2>
              <button 
                onClick={openAddModal}
                className="bg-vibrantgreen text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-deepgreen transition-colors font-medium shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-sm">Image</th>
                  <th className="px-6 py-4 font-semibold text-sm">Name</th>
                  <th className="px-6 py-4 font-semibold text-sm">Category</th>
                  <th className="px-6 py-4 font-semibold text-sm">Price (PKR)</th>
                  <th className="px-6 py-4 font-semibold text-sm">Stock</th>
                  <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">Loading products...</td>
                  </tr>
                ) : products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <img src={product.imageUrl || product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-mintwhite text-deepgreen border border-green-200 text-xs px-3 py-1 rounded-full font-semibold">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">₹{product.basePricePKR || product.price}</td>
                    <td className="px-6 py-4">
                      {product.inStock ? (
                        <span className="text-green-600 font-semibold text-sm flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>In Stock</span>
                      ) : (
                        <span className="text-red-500 font-semibold text-sm flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Out of Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 hover:shadow-sm rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 hover:shadow-sm rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && products.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No products found. Click "Add New Product" to get started.
              </div>
            )}
          </div>
        </div>
        </>
        ) : (
          <AdminOrders />
        )}
      </main>

      {isModalOpen && (
        <ProductForm 
          onClose={() => setIsModalOpen(false)} 
          refreshData={fetchProducts}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
