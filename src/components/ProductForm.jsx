import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const ProductForm = ({ onClose, refreshData, editingProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fertilizer',
    basePricePKR: '',
    unitSize: '',
    inStock: true,
    activeIngredients: '',
    targetCrops: '',
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        basePricePKR: editingProduct.basePricePKR || editingProduct.price || '',
        unitSize: editingProduct.unitSize || editingProduct.unit || '',
        inStock: editingProduct.inStock,
        activeIngredients: editingProduct.activeIngredients?.join(', ') || '',
        targetCrops: editingProduct.targetCrops?.join(', ') || '',
        imageUrl: editingProduct.imageUrl || editingProduct.image || ''
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      activeIngredients: formData.activeIngredients.split(',').map(s => s.trim()).filter(Boolean),
      targetCrops: formData.targetCrops.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingProduct) {
        await axios.put(`${import.meta.env.VITE_API_URL}/products/${editingProduct._id}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, payload);
      }
      refreshData();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-deepgreen">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all">
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Micronutrient">Micronutrient</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base Price (PKR)</label>
                <input required type="number" min="0" name="basePricePKR" value={formData.basePricePKR} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit Size (e.g., 50kg, 1L)</label>
                <input required name="unitSize" value={formData.unitSize} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
              <input required name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Active Ingredients</label>
                <input name="activeIngredients" value={formData.activeIngredients} onChange={handleChange} placeholder="Comma separated" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Crops</label>
                <input name="targetCrops" value={formData.targetCrops} onChange={handleChange} placeholder="Comma separated" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:border-transparent outline-none transition-all text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input type="checkbox" id="inStock" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 text-vibrantgreen focus:ring-vibrantgreen border-gray-300 rounded cursor-pointer" />
              <label htmlFor="inStock" className="text-sm font-bold text-gray-700 cursor-pointer">Currently in Stock</label>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-8">
              <button type="button" onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button disabled={loading} type="submit" className="px-6 py-3 bg-vibrantgreen text-white font-bold hover:bg-deepgreen hover:shadow-lg rounded-xl transition-all disabled:opacity-50">
                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
