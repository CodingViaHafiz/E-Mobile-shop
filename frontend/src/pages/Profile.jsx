import React from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-5xl text-white">
              {user?.name?.charAt(0) || '👤'}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600 mt-2">{user?.email}</p>
              <p className="text-purple-600 font-semibold mt-2 capitalize">Role: {user?.role}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-600 font-semibold">Full Name</label>
                <p className="text-gray-800 text-lg mt-2">{user?.name}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">Email Address</label>
                <p className="text-gray-800 text-lg mt-2">{user?.email}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">Account Type</label>
                <p className="text-gray-800 text-lg mt-2 capitalize">{user?.role}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">Account Status</label>
                <p className="text-green-600 text-lg mt-2 font-semibold">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition duration-300 shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
