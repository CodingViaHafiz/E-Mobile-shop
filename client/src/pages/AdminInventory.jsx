import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiFilter,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import axiosInstance from "../services/api";

export const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axiosInstance.get("/admin/inventory");
      setProducts(data?.products || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStock === "low") return matchesSearch && product.stock <= 10;
    if (filterStock === "outofstock") return matchesSearch && product.stock === 0;
    return matchesSearch;
  });

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: FiPackage,
      color: "#3b82f6",
    },
    {
      label: "Low Stock",
      value: products.filter((p) => p.stock <= 10).length,
      icon: FiAlertCircle,
      color: "#f59e0b",
    },
    {
      label: "Out of Stock",
      value: products.filter((p) => p.stock === 0).length,
      icon: FiAlertCircle,
      color: "#ef4444",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading inventory...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                Inventory Management
              </h1>
              <p className="text-slate-600 mt-2 font-medium">
                Manage your products and stock levels
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchInventory}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all"
            >
              <FiRefreshCw size={20} />
              Refresh
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: stat.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold"
            >
              {error}
            </motion.div>
          )}

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by product name, category, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all font-medium"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <FiFilter className="hidden sm:block mt-3 text-slate-400" size={20} />
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  <option value="all">All Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="outofstock">Out of Stock</option>
                </select>
              </div>

              {/* Add Product Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all whitespace-nowrap"
              >
                <FiPlus size={20} />
                Add Product
              </motion.button>
            </div>
          </motion.div>

          {/* Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
          >
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Category
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, idx) => {
                      const stockStatus =
                        product.stock === 0
                          ? { bg: "bg-red-50", text: "text-red-700", label: "Out of Stock" }
                          : product.stock <= 10
                          ? { bg: "bg-yellow-50", text: "text-yellow-700", label: "Low Stock" }
                          : { bg: "bg-green-50", text: "text-green-700", label: "In Stock" };

                      return (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-slate-900">{product.name}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {product.brand}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                              {product.sku || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className={`px-3 py-1 rounded-lg text-sm font-bold ${stockStatus.bg} ${stockStatus.text} inline-block`}
                            >
                              {product.stock} units
                            </motion.span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-bold text-slate-900 text-lg">
                              ${product.price?.toFixed(2) || "0.00"}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                title="Edit"
                              >
                                <FiEdit2 size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 size={18} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <p className="text-slate-600 font-semibold">
                          {searchTerm || filterStock !== "all"
                            ? "No products found"
                            : "No products in inventory"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};
