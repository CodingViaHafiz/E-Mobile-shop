import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiBarChart2,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminStatCard } from "../components/AdminStatCard";
import { inventoryApi } from "../services/inventory";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    topSellingProducts: [],
    lowStockByCategory: [],
    stockMovementTrend: [],
    recentOrders: [],
  });
  const [summary, setSummary] = useState({
    stats: {
      totalProducts: 0,
      totalUnits: 0,
      stockValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAnalytics = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const [analyticsData, summaryData] = await Promise.all([
        inventoryApi.getInventoryAnalytics(),
        inventoryApi.getInventorySummary(),
      ]);
      setAnalytics(analyticsData);
      setSummary(summaryData);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Failed to load analytics",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const movementTotals = useMemo(() => {
    return analytics.stockMovementTrend.reduce(
      (totals, entry) => {
        if (entry._id.type === "inward") {
          totals.inward += entry.quantity;
        } else if (entry._id.type === "outward") {
          totals.outward += entry.quantity;
        } else {
          totals.adjustments += entry.quantity;
        }

        return totals;
      },
      { inward: 0, outward: 0, adjustments: 0 },
    );
  }, [analytics.stockMovementTrend]);

  const statCards = [
    {
      label: "Stock value",
      value: `$${(summary.stats.stockValue || 0).toFixed(0)}`,
      icon: FiTrendingUp,
      accent: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      hint: "Current inventory value based on stock and price",
    },
    {
      label: "Units on hand",
      value: summary.stats.totalUnits || 0,
      icon: FiPackage,
      accent: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
      hint: "Total units across the whole catalog",
    },
    {
      label: "Low-stock items",
      value: summary.stats.lowStockCount || 0,
      icon: FiAlertCircle,
      accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      hint: "Products currently at replenishment risk",
    },
    {
      label: "Recent orders",
      value: analytics.recentOrders?.length || 0,
      icon: FiShoppingBag,
      accent: "linear-gradient(135deg, #fb7185 0%, #dc2626 100%)",
      hint: "Most recent orders tracked by the backend",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-panel flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading analytics...
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
          eyebrow="Inventory Analytics"
          title="Track stock pressure and sales momentum"
          description="These analytics are driven by live products, stock movement logs, and orders so admins can spot replenishment pressure and the top-selling devices quickly."
          meta={[
            `${movementTotals.outward} units sold or deducted`,
            `${movementTotals.inward} units added`,
            `${analytics.topSellingProducts.length} top sellers tracked`,
          ]}
          actions={
            <button
              onClick={() => fetchAnalytics(true)}
              className="admin-button-primary"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          }
        />

        {error && (
          <div className="admin-panel border-red-200/80 bg-red-50/90 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <motion.div key={stat.label} {...sectionMotion}>
              <AdminStatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.section {...sectionMotion} className="admin-section">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <FiBarChart2 size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Top-selling products
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Products ranked by cumulative sold count.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {analytics.topSellingProducts.length > 0 ? (
                analytics.topSellingProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950">
                          {index + 1}. {product.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {product.brand} {product.model}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                        {product.soldCount} sold
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                      <span>Stock left: {product.stock}</span>
                      <span>${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-soft-panel p-5 text-sm text-slate-600">
                  Orders have not generated top-selling data yet.
                </div>
              )}
            </div>
          </motion.section>

          <motion.section {...sectionMotion} className="admin-section">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <FiAlertCircle size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Low stock by category
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Categories with the most replenishment risk.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {analytics.lowStockByCategory.length > 0 ? (
                analytics.lowStockByCategory.map((entry) => (
                  <div
                    key={entry._id}
                    className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-950">{entry._id}</p>
                      <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
                        {entry.count} items
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-soft-panel p-5 text-sm text-slate-600">
                  No category is under low-stock pressure right now.
                </div>
              )}
            </div>
          </motion.section>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
          <motion.section {...sectionMotion} className="admin-section">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <FiTrendingUp size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Stock movement totals
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Aggregated from inventory log activity over the last 30 days.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="admin-soft-panel p-5">
                <p className="text-sm font-semibold text-slate-500">Inward</p>
                <p className="mt-3 text-3xl font-black text-slate-950">
                  {movementTotals.inward}
                </p>
              </div>
              <div className="admin-soft-panel p-5">
                <p className="text-sm font-semibold text-slate-500">Outward</p>
                <p className="mt-3 text-3xl font-black text-slate-950">
                  {movementTotals.outward}
                </p>
              </div>
              <div className="admin-soft-panel p-5">
                <p className="text-sm font-semibold text-slate-500">Adjustments</p>
                <p className="mt-3 text-3xl font-black text-slate-950">
                  {movementTotals.adjustments}
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section {...sectionMotion} className="admin-section">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <FiShoppingBag size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Recent orders
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  The latest orders that affected stock counts.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {analytics.recentOrders.length > 0 ? (
                analytics.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950">{order.orderNumber}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.items.length} item(s)
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      <span className="font-semibold text-slate-900">
                        ${order.grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-soft-panel p-5 text-sm text-slate-600">
                  No recent orders have been placed yet.
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </AdminLayout>
  );
};
