import React from 'react';
import { useAuth } from '../store/AuthContext';

export const Account = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Account</h1>

        {/* Account Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <p className="text-gray-600 font-semibold">Total Orders</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">12</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-gray-600 font-semibold">Total Spent</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">$4,299</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <p className="text-gray-600 font-semibold">Loyalty Points</p>
              <p className="text-3xl font-bold text-green-600 mt-2">4,299</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {[
              { id: 'ORD-001', product: 'iPhone 15 Pro', date: 'Apr 20, 2026', status: 'Delivered', price: '$999' },
              { id: 'ORD-002', product: 'Samsung S24 Ultra', date: 'Apr 18, 2026', status: 'Shipped', price: '$1,199' },
              { id: 'ORD-003', product: 'Google Pixel 8', date: 'Apr 15, 2026', status: 'Processing', price: '$799' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div>
                  <p className="font-bold text-gray-800">{order.product}</p>
                  <p className="text-gray-600 text-sm">{order.id} • {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{order.price}</p>
                  <p className={`text-sm font-semibold ${order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Addresses</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-800">Home</p>
                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-semibold">Default</span>
              </div>
              <p className="text-gray-600 text-sm">123 Main Street, City, State 12345</p>
            </div>
          </div>
          <button className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300 mt-6">
            Add New Address
          </button>
        </div>
      </div>
    </div>
  );
};
