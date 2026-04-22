import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiAward,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const Account = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const stats = [
    { label: "Total Orders", value: "12", icon: FiShoppingBag },
    { label: "Total Spent", value: "$4,299", icon: FiDollarSign },
    { label: "Loyalty Points", value: "4,299", icon: FiAward },
    { label: "Avg. Savings", value: "$186/mo", icon: FiTrendingUp },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      product: "iPhone 15 Pro",
      date: "Apr 20, 2026",
      status: "Delivered",
      price: "$999",
    },
    {
      id: "ORD-002",
      product: "Samsung S24 Ultra",
      date: "Apr 18, 2026",
      status: "Shipped",
      price: "$1,199",
    },
    {
      id: "ORD-003",
      product: "Google Pixel 8",
      date: "Apr 15, 2026",
      status: "Processing",
      price: "$799",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#10b981";
      case "Shipped":
        return "#3b82f6";
      case "Processing":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return FiCheckCircle;
      case "Shipped":
        return FiTruck;
      case "Processing":
        return FiClock;
      default:
        return FiShoppingBag;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8" style={{ background: COLORS.neutral.bg }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            My Account
          </h1>
          <p className="text-neutral-600 text-lg">Overview of your purchases and activity</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl border border-neutral-100 p-6 transition-all duration-300"
                style={{
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <Icon size={24} />
                </div>
                <p className="text-neutral-600 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="mb-8 flex gap-4 border-b-2 border-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {["overview", "orders", "wishlist"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-4 font-semibold text-lg transition-all duration-300 border-b-4 -mb-2 capitalize"
              style={{
                borderColor: activeTab === tab ? COLORS.primary.main : "transparent",
                color: activeTab === tab ? COLORS.primary.main : COLORS.neutral.textLight,
              }}
              whileHover={{ scale: 1.05 }}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <FiShoppingBag size={28} style={{ color: COLORS.primary.main }} />
                Recent Orders
              </h2>
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-neutral-100 hover:border-blue-600 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{
                            background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                          }}
                        >
                          <FiShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{order.product}</p>
                          <p className="text-sm text-neutral-600">
                            {order.id} • {order.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neutral-900">{order.price}</p>
                        <motion.p
                          className="text-sm font-semibold flex items-center gap-1 justify-end"
                          style={{ color: getStatusColor(order.status) }}
                        >
                          <StatusIcon size={16} />
                          {order.status}
                        </motion.p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Activity Chart Placeholder */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Spending Trend</h2>
              <div className="h-64 flex items-end justify-between px-2 gap-2">
                {[40, 75, 50, 85, 60, 90, 70].map((height, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-1 rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                      height: `${height}%`,
                      minHeight: "30px",
                    }}
                    whileHover={{ scale: 1.05 }}
                    title={`Week ${idx + 1}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-sm text-neutral-600">
                {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"].map(
                  (week, idx) => (
                    <span key={idx}>{week}</span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-100 p-8"
          >
            <div className="grid gap-4">
              {recentOrders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-xl border-2 border-neutral-100 hover:border-blue-600 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-neutral-900">{order.product}</p>
                      <p className="text-sm text-neutral-600">{order.id}</p>
                    </div>
                    <motion.p
                      className="text-sm font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                      }}
                    >
                      {order.status}
                    </motion.p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-neutral-600">{order.date}</p>
                    <p className="text-xl font-bold text-neutral-900">{order.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "wishlist" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-100 p-12 text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: `${COLORS.primary.main}20`,
              }}
            >
              <FiAward size={40} style={{ color: COLORS.primary.main }} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Wishlist Items</h3>
            <p className="text-neutral-600 mb-6">Start adding items to your wishlist</p>
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05 }}
              className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
              }}
            >
              Continue Shopping
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
};
//               </div >
//             ))}
//           </div >
//         </div >

//   {/* Addresses */ }
//   < div className = "bg-white rounded-2xl shadow-lg p-8" >
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Addresses</h2>
//           <div className="space-y-4">
//             <div className="p-4 border border-gray-200 rounded-lg">
//               <div className="flex items-center justify-between mb-2">
//                 <p className="font-bold text-gray-800">Home</p>
//                 <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-semibold">Default</span>
//               </div>
//               <p className="text-gray-600 text-sm">123 Main Street, City, State 12345</p>
//             </div>
//           </div>
//           <button className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300 mt-6">
//             Add New Address
//           </button>
//         </div >
//       </div >
//     </div >
//   );
// };
