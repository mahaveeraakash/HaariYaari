import React, { useState } from 'react';
import { Menu, Search, X, ShoppingCart, Leaf, Sprout, Bug } from 'lucide-react';
import { products } from './data';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fertilizers', 'Pesticides', 'Micronutrients'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsSidebarOpen(false);
    // Scroll to products
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-mintwhite font-sans text-deepgreen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 rounded-full bg-vibrantgreen flex items-center justify-center text-white font-bold">
              HY
            </div>
            <span className="text-2xl font-bold text-deepgreen tracking-tight">HaariYaari</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-deepgreen hover:text-vibrantgreen transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button className="p-2 text-deepgreen hover:text-vibrantgreen transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </button>
            <button 
              className="p-2 text-deepgreen hover:text-vibrantgreen transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-deepgreen">Categories</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                selectedCategory === cat 
                  ? 'bg-vibrantgreen text-white font-semibold shadow-md' 
                  : 'text-deepgreen hover:bg-mintwhite hover:text-vibrantgreen font-medium'
              }`}
            >
              {cat === 'Fertilizers' && <Sprout className="w-5 h-5" />}
              {cat === 'Pesticides' && <Bug className="w-5 h-5" />}
              {cat === 'Micronutrients' && <Leaf className="w-5 h-5" />}
              {cat === 'All' && <div className="w-5 h-5 flex items-center justify-center font-bold text-sm">All</div>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-mintwhite to-green-100 py-24 sm:py-32 px-4 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-vibrantgreen rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl sm:text-7xl font-extrabold text-deepgreen mb-6 tracking-tight drop-shadow-sm">
              HaariYaari
            </h1>
            <p className="text-2xl sm:text-3xl text-deepgreen/80 font-medium mb-10">
              "Kisan ka dost"
            </p>
            <button 
              onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
              className="bg-vibrantgreen text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-deepgreen hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out inline-flex items-center gap-2"
            >
              Explore Products
              <Leaf className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Product Grid Section */}
        <section id="products-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold text-deepgreen">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <div className="text-sm font-medium text-deepgreen/70 bg-white px-4 py-2 rounded-full shadow-sm border border-green-100">
              Showing {filteredProducts.length} items
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-50 flex flex-col hover:-translate-y-2"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-deepgreen shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-deepgreen mb-1 line-clamp-1 group-hover:text-vibrantgreen transition-colors">{product.name}</h3>
                  <div className="text-sm text-gray-500 mb-4">{product.unit}</div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-extrabold text-deepgreen">₹{product.price}</span>
                    <button className="bg-mintwhite text-vibrantgreen p-2 rounded-full hover:bg-vibrantgreen hover:text-white transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-lg">
              No products found in this category.
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-deepgreen text-mintwhite mt-auto rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-10 h-10 rounded-full bg-vibrantgreen flex items-center justify-center text-white font-bold text-lg">
                  HY
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">HaariYaari</span>
              </div>
              <p className="text-mintwhite/80 max-w-xs font-medium">
                "Kisan ka dost" - Empowering farmers with quality agricultural products.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 items-center md:items-start">
              <h4 className="text-lg font-bold text-white mb-2">Quick Links</h4>
              <a href="#" className="hover:text-vibrantgreen transition-colors">About Us</a>
              <a href="#" className="hover:text-vibrantgreen transition-colors">Contact Us</a>
              <a href="#" className="hover:text-vibrantgreen transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-vibrantgreen transition-colors">Privacy Policy</a>
            </div>

            <div className="flex flex-col gap-3 items-center md:items-start">
              <h4 className="text-lg font-bold text-white mb-2">Contact</h4>
              <p className="text-mintwhite/80">support@haariyaari.com</p>
              <p className="text-mintwhite/80">+91 1800-123-4567</p>
              <div className="flex gap-4 mt-2">
                {/* Social Placeholders */}
                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-vibrantgreen transition-colors cursor-pointer flex items-center justify-center">
                  <span className="sr-only">Facebook</span>
                  f
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-vibrantgreen transition-colors cursor-pointer flex items-center justify-center">
                   <span className="sr-only">Twitter</span>
                   t
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-vibrantgreen transition-colors cursor-pointer flex items-center justify-center">
                   <span className="sr-only">Instagram</span>
                   i
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-mintwhite/60">
            &copy; {new Date().getFullYear()} HaariYaari. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
