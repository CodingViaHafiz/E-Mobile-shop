import React from 'react';

import { FiTruck, FiLock, FiCheckCircle, FiSmartphone } from 'react-icons/fi';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:pt-20 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
          Welcome to <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">E-Mobile</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Explore the latest mobile phones and accessories with unbeatable deals
        </p>
        <a href="/shop" className="inline-block bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-4 px-10 rounded-full hover:from-purple-700 hover:to-purple-900 transition duration-300 text-lg shadow-lg">
          Start Shopping
        </a>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          {
            title: 'Fast Delivery',
            description: 'Get your order within 24 hours',
            icon: FiTruck,
          },
          {
            title: 'Secure Payment',
            description: 'Safe and encrypted transactions',
            icon: FiLock,
          },
          {
            title: '100% Authentic',
            description: 'Genuine products guaranteed',
            icon: FiCheckCircle,
          },
        ].map((feature, idx) => {
          const FeatureIcon = feature.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-300 border border-gray-100 hover:border-purple-200"
            >
              <FeatureIcon className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Featured Products */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300 group cursor-pointer"
              >
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition duration-300 flex items-center justify-center">
                  <FiSmartphone className="text-5xl text-gray-700" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Premium Phone {item}</h4>
                <p className="text-gray-600 text-sm mb-4">High-quality mobile device</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-600">$999</span>
                  <button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-900 transition duration-300">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
