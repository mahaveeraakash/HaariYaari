import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Leaf } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, {
        username,
        password
      });
      login(data.token, data.username);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-mintwhite flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-vibrantgreen flex items-center justify-center text-white">
            <Leaf className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-deepgreen mb-8">Admin Portal</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deepgreen mb-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-deepgreen mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibrantgreen focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-vibrantgreen text-white font-bold py-3 rounded-xl hover:bg-deepgreen transition-colors mt-6"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
