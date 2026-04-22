import React, { useState } from 'react';
import { FiSmartphone, FiStar } from 'react-icons/fi';

export const Shop = () => {
  const [products] = useState([
    { id: 1, name: 'iPhone 15 Pro', price: 999, category: 'Apple', rating: 4.8 },
    { id: 2, name: 'Samsung S24 Ultra', price: 1199, category: 'Samsung', rating: 4.7 },
    { id: 3, name: 'Google Pixel 8', price: 799, category: 'Google', rating: 4.6 },
    { id: 4, name: 'OnePlus 12', price: 799, category: 'OnePlus', rating: 4.5 },
    { id: 5, name: 'Xiaomi 14 Ultra', price: 849, category: 'Xiaomi', rating: 4.4 },
    { id: 6, name: 'Nothing Phone', price: 599, category: 'Nothing', rating: 4.3 },
    { id: 7, name: 'Motorola Edge 50', price: 499, category: 'Motorola', rating: 4.2 },
    { id: 8, name: 'Realme 12 Pro', price: 449, category: 'Realme', rating: 4.1 },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shop</h1>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-semibold transition ${selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden group"
            >
              <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:from-purple-300 group-hover:to-purple-400 transition duration-300 flex items-center justify-center">
                <span className="text-gray-700 font-semibold">📱</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{product.category}</span>
                  <span className="text-yellow-500 font-semibold">⭐ {product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                  <button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-900 transition">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
