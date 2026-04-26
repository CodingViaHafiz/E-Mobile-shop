import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";
import { orderApi } from "../services/orders";
import { formatPKR } from "../utils/currency";

const statusTone = {
  pending: {
    color: "#d97706",
    background: "#fef3c7",
    icon: FiClock,
  },
  processing: {
    color: "#2563eb",
    background: "#dbeafe",
    icon: FiPackage,
  },
  shipped: {
    color: "#7c3aed",
    background: "#ede9fe",
    icon: FiTruck,
  },
  delivered: {
    color: "#059669",
    background: "#d1fae5",
    icon: FiCheckCircle,
  },
  cancelled: {
    color: "#dc2626",
    background: "#fee2e2",
    icon: FiClock,
  },
};

const formatLabel = (value = "") =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDate = (value) =>
  new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const Account = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await orderApi.getMyOrders();

        if (!ignore) {
          setOrders(data.orders || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError?.response?.data?.message || "Failed to load your orders");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const deliveredOrders = orders.filter((order) => order.status === "delivered");
    const processingOrders = orders.filter((order) =>
      ["pending", "processing", "shipped"].includes(order.status),
    );
    const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
    const totalSpent = deliveredOrders.reduce(
      (sum, order) => sum + (order.grandTotal || 0),
      0,
    );

    return [
      {
        label: "Total Orders",
        value: orders.length,
        icon: FiShoppingBag,
      },
      {
        label: "Active Orders",
        value: processingOrders.length,
        icon: FiPackage,
      },
      {
        label: "Delivered",
        value: deliveredOrders.length,
        icon: FiCheckCircle,
      },
      {
        label: "Total Spent",
        value: formatPKR(totalSpent, { maximumFractionDigits: 0 }),
        icon: FiCreditCard,
      },
      {
        label: "Paid Orders",
        value: paidOrders.length,
        icon: FiCreditCard,
      },
    ];
  }, [orders]);

  const renderOrders = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-2xl border border-neutral-100 p-8">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-neutral-600">
              Loading your orders...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm font-semibold text-red-700">
          {error}
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-12 text-center">
          <h3 className="text-2xl font-bold text-neutral-900">No orders yet</h3>
          <p className="mt-3 text-neutral-600">
            When you place an order, it will be stored in the database and tracked here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => {
          const tone = statusTone[order.status] || statusTone.pending;
          const StatusIcon = tone.icon;

          return (
            <motion.div
              key={order._id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl border border-neutral-100 p-6 transition-all duration-300"
              style={{
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-bold text-neutral-900">
                        {order.orderNumber}
                      </p>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: tone.background,
                          color: tone.color,
                        }}
                      >
                        <StatusIcon size={14} />
                        {formatLabel(order.status)}
                      </span>
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background:
                            order.paymentStatus === "paid" ? "#d1fae5" : "#fef3c7",
                          color: order.paymentStatus === "paid" ? "#059669" : "#d97706",
                        }}
                      >
                        {formatLabel(order.paymentStatus)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600">{formatDate(order.createdAt)}</p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-neutral-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Shipping
                      </p>
                      <p className="mt-2 text-sm font-semibold text-neutral-900">
                        {order.shippingAddress?.addressLine1}
                      </p>
                      {order.shippingAddress?.addressLine2 ? (
                        <p className="mt-1 text-sm text-neutral-600">
                          {order.shippingAddress.addressLine2}
                        </p>
                      ) : null}
                      <p className="mt-1 text-sm text-neutral-600">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.postalCode}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        {order.shippingAddress?.country}
                      </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Payment & Tracking
                      </p>
                      <p className="mt-2 text-sm font-semibold text-neutral-900">
                        {formatLabel(order.paymentMethod)}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        Tracking: {order.trackingNumber || "Not assigned yet"}
                      </p>
                      {order.notes ? (
                        <p className="mt-2 text-sm text-neutral-600">{order.notes}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-md rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      Items
                    </p>
                    <p className="text-lg font-bold text-neutral-900">
                      {formatPKR(order.grandTotal)}
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={`${order._id}-${item.product}-${item.name}`}
                        className="flex items-center justify-between gap-3 text-sm text-neutral-600"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold text-neutral-900">
                          {formatPKR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24 pt-20 md:pb-8" style={{ background: COLORS.neutral.bg }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            My Account
          </h1>
          <p className="text-neutral-600 text-lg">
            Your orders are stored in the database and updated live from the admin side.
          </p>
        </motion.div>

        <div className="mb-8 flex gap-4 border-b-2 border-neutral-200">
          {["overview", "orders"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-4 font-semibold text-lg transition-all duration-300 border-b-4 -mb-2 capitalize"
              style={{
                borderColor: activeTab === tab ? COLORS.primary.main : "transparent",
                color: activeTab === tab ? COLORS.primary.main : COLORS.neutral.textLight,
              }}
              whileHover={{ scale: 1.03 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-neutral-100 p-6 transition-all duration-300"
                    style={{
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <p className="text-neutral-600 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {renderOrders()}
          </div>
        )}

        {activeTab === "orders" && renderOrders()}
      </div>
    </div>
  );
};
