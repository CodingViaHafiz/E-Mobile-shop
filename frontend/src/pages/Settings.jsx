import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';

export const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    twoFactor: false,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Settings</h1>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
          <div className="space-y-4">
            {[
              { key: 'notifications', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
              { key: 'emailUpdates', label: 'Email Updates', desc: 'Receive email about your orders and promotions' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-800">{item.label}</p>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={() => handleToggle(item.key)}
                  className="w-6 h-6 text-purple-600 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div>
                <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
                <p className="text-gray-600 text-sm">Add an extra layer of security</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={() => handleToggle('twoFactor')}
                className="w-6 h-6 text-purple-600 rounded cursor-pointer"
              />
            </div>
            <button className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
