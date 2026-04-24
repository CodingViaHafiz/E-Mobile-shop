import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiFilter,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminStatCard } from "../components/AdminStatCard";
import axiosInstance from "../services/api";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all");

  const fetchInventory = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const { data } = await axiosInstance.get("/admin/inventory");
      setProducts(data?.products || []);
    } catch (requestError) {
      const message = requestError?.response?.data?.message;
      const status = requestError?.response?.status;

      setError(
        status === 404
          ? "The inventory API is not connected yet, so this page is showing its designed empty state."
          : message || "Failed to load inventory"
      );
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term);

      if (filterStock === "low") {
        return matchesSearch && product.stock > 0 && product.stock <= 10;
      }

      if (filterStock === "outofstock") {
        return matchesSearch && product.stock === 0;
      }

      return matchesSearch;
    });
  }, [filterStock, products, searchTerm]);

  const stats = [
    {
      label: "Products",
      value: products.length,
      icon: FiPackage,
      accent: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      hint: "Items currently returned by the API",
    },
    {
      label: "Low stock",
      value: products.filter((product) => product.stock > 0 && product.stock <= 10).length,
      icon: FiAlertCircle,
      accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      hint: "Products that need replenishment soon",
    },
    {
      label: "Out of stock",
      value: products.filter((product) => product.stock === 0).length,
      icon: FiAlertCircle,
      accent: "linear-gradient(135deg, #fb7185 0%, #dc2626 100%)",
      hint: "Products that cannot currently be sold",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-panel flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading inventory...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminPageHeader
          eyebrow="Inventory"
          title="Keep the catalog easy to scan"
          description="The inventory page now uses the same admin shell, clearer controls, and safer empty states so it still feels polished even when the inventory backend is incomplete."
          meta={[
            `${products.length} products loaded`,
            `${products.filter((product) => product.stock === 0).length} out of stock`,
            "Prepared for CRUD workflows",
          ]}
          actions={
            <>
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-400 opacity-80"
              >
                <FiPlus />
                Add product
              </button>
              <button
                onClick={() => fetchInventory(true)}
                className="admin-button-primary"
              >
                <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </>
          }
        />

        {error && (
          <div className="admin-panel border-amber-200/80 bg-amber-50/90 p-4 text-sm font-semibold text-amber-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <motion.div key={stat.label} {...sectionMotion}>
              <AdminStatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <motion.section {...sectionMotion} className="admin-section space-y-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by product, category, or SKU"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="admin-input pl-11"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
                <FiFilter size={18} />
              </div>
              <select
                value={filterStock}
                onChange={(event) => setFilterStock(event.target.value)}
                className="admin-select"
              >
                <option value="all">All stock</option>
                <option value="low">Low stock</option>
                <option value="outofstock">Out of stock</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-4 py-4">Product</th>
                    <th className="px-4 py-4">SKU</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4 text-center">Stock</th>
                    <th className="px-4 py-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus =
                      product.stock === 0
                        ? "bg-red-50 text-red-700"
                        : product.stock <= 10
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700";

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-slate-200/80 transition hover:bg-blue-50/40"
                      >
                        <td className="px-4 py-5">
                          <p className="font-bold text-slate-950">{product.name}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {product.brand || "Unbranded"}
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          <span className="rounded-xl bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                            {product.sku || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                            {product.category || "General"}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${stockStatus}`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-4 py-5 text-right text-lg font-black text-slate-950">
                          ${product.price?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/90 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-lg shadow-slate-900/5">
                <FiPackage size={28} />
              </div>
              <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
                No inventory to display yet
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {searchTerm || filterStock !== "all"
                  ? "The current filters returned no matching products."
                  : "Once the inventory endpoint is connected, this table is ready to present products with the same visual language as the rest of the admin area."}
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </AdminLayout>
  );
};
