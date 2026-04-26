import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminStatCard } from "../components/AdminStatCard";
import { orderApi } from "../services/orders";
import { formatPKR } from "../utils/currency";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_OPTIONS = ["pending", "paid", "failed"];

const statusTone = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  processing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  shipped: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const paymentTone = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  failed: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const formatLabel = (value = "") =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const compactDate = (value) =>
  new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const AdminOrders = () => {
  const [ordersData, setOrdersData] = useState({
    orders: [],
    pagination: {
      page: 1,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [trackingDrafts, setTrackingDrafts] = useState({});

  const loadOrders = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const data = await orderApi.getAdminOrders({
        search,
        status: statusFilter,
        paymentStatus: paymentStatusFilter,
        page,
        limit: 10,
      });
      setOrdersData(data);
      setTrackingDrafts((current) => {
        const nextDrafts = { ...current };

        data.orders.forEach((order) => {
          if (nextDrafts[order._id] === undefined) {
            nextDrafts[order._id] = order.trackingNumber || "";
          }
        });

        return nextDrafts;
      });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter, paymentStatusFilter, page]);

  const orderSummary = useMemo(() => {
    const orders = ordersData.orders || [];

    return {
      pending: orders.filter((order) => order.status === "pending").length,
      processing: orders.filter((order) => order.status === "processing").length,
      shipped: orders.filter((order) => order.status === "shipped").length,
      revenue: orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0),
    };
  }, [ordersData.orders]);

  const stats = [
    {
      label: "Pending queue",
      value: orderSummary.pending,
      icon: FiClock,
      accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      hint: "New orders waiting for confirmation",
    },
    {
      label: "Processing",
      value: orderSummary.processing,
      icon: FiPackage,
      accent: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      hint: "Orders currently being prepared",
    },
    {
      label: "Shipped",
      value: orderSummary.shipped,
      icon: FiTruck,
      accent: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      hint: "Orders already dispatched",
    },
    {
      label: "Visible revenue",
      value: formatPKR(orderSummary.revenue, { maximumFractionDigits: 0 }),
      icon: FiCreditCard,
      accent: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
      hint: "Value of orders in the current result set",
    },
  ];

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");
      setFeedback("");
      await orderApi.updateAdminOrder(orderId, updates);
      setFeedback("Order updated successfully");
      await loadOrders(true);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to update order");
    } finally {
      setUpdatingOrderId("");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-panel flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          eyebrow="Orders"
          title="Order Operations"
          description="Track payment, fulfillment, and shipment progress from one queue."
          meta={[
            `${ordersData.pagination.total || 0} total orders`,
            `${statusFilter === "all" ? "all statuses" : formatLabel(statusFilter)}`,
            `${paymentStatusFilter === "all" ? "all payments" : formatLabel(paymentStatusFilter)}`,
          ]}
          actions={
            <button
              onClick={() => loadOrders(true)}
              className="admin-button-primary w-full sm:w-auto"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          }
        />

        {feedback && (
          <div className="admin-panel border-emerald-200/80 bg-emerald-50/90 p-4 text-sm font-semibold text-emerald-700">
            {feedback}
          </div>
        )}

        {error && (
          <div className="admin-panel border-red-200/80 bg-red-50/90 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <motion.div key={stat.label} {...sectionMotion}>
              <AdminStatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <motion.section {...sectionMotion} className="admin-section !p-0 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6">
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_140px]">
              <div className="relative">
                <FiSearch
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                  placeholder="Search order, customer, email, or phone"
                  className="admin-input pl-11"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setPage(1);
                  setStatusFilter(event.target.value);
                }}
                className="admin-select w-full"
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {formatLabel(status)}
                  </option>
                ))}
              </select>

              <select
                value={paymentStatusFilter}
                onChange={(event) => {
                  setPage(1);
                  setPaymentStatusFilter(event.target.value);
                }}
                className="admin-select w-full"
              >
                <option value="all">All payments</option>
                {PAYMENT_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {formatLabel(status)}
                  </option>
                ))}
              </select>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                {ordersData.pagination.total || 0} results
              </div>
            </div>
          </div>

          {ordersData.orders?.length > 0 ? (
            <>
              <div className="hidden xl:block">
                <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr_0.9fr_1.1fr] gap-4 border-b border-slate-200 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <p>Order</p>
                  <p>Customer</p>
                  <p>Delivery</p>
                  <p>Payment</p>
                  <p>Tracking</p>
                  <p>Actions</p>
                </div>

                <div className="divide-y divide-slate-200">
                  {ordersData.orders.map((order) => (
                    <div
                      key={order._id}
                      className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr_0.9fr_1.1fr] gap-4 px-6 py-5 transition hover:bg-slate-50/70"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-950">{order.orderNumber}</p>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusTone[order.status]}`}
                          >
                            {formatLabel(order.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {order.items.length} item(s) | {formatPKR(order.grandTotal)}
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                          {compactDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-950">
                          {order.customer?.fullName}
                        </p>
                        <p className="mt-1 truncate text-sm text-slate-600">
                          {order.customer?.email}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{order.customer?.phone}</p>
                      </div>

                      <div className="min-w-0 text-sm text-slate-600">
                        <p className="truncate font-semibold text-slate-900">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </p>
                        <p className="mt-1 truncate">{order.shippingAddress?.addressLine1}</p>
                        <p className="mt-1 text-slate-500">
                          {order.shippingAddress?.country} {order.shippingAddress?.postalCode}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${paymentTone[order.paymentStatus]}`}
                        >
                          {formatLabel(order.paymentStatus)}
                        </span>
                        <p className="mt-2 text-sm capitalize text-slate-600">
                          {formatLabel(order.paymentMethod)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <input
                          value={trackingDrafts[order._id] ?? order.trackingNumber ?? ""}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) =>
                            setTrackingDrafts((current) => ({
                              ...current,
                              [order._id]: event.target.value,
                            }))
                          }
                          placeholder="Add tracking"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                        <button
                          type="button"
                          disabled={updatingOrderId === order._id}
                          onClick={() =>
                            handleUpdateOrder(order._id, {
                              trackingNumber: trackingDrafts[order._id] ?? "",
                            })
                          }
                          className="inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Save tracking
                        </button>
                      </div>

                      <div className="grid gap-2">
                        <select
                          value={order.status}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) =>
                            handleUpdateOrder(order._id, { status: event.target.value })
                          }
                          className="admin-select w-full !rounded-xl !px-3 !py-2"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>

                        <select
                          value={order.paymentStatus}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) =>
                            handleUpdateOrder(order._id, {
                              paymentStatus: event.target.value,
                            })
                          }
                          className="admin-select w-full !rounded-xl !px-3 !py-2"
                        >
                          {PAYMENT_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-4 xl:hidden sm:p-6">
                {ordersData.orders.map((order) => (
                  <article
                    key={order._id}
                    className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950">{order.orderNumber}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.customer?.fullName}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusTone[order.status]}`}
                        >
                          {formatLabel(order.status)}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${paymentTone[order.paymentStatus]}`}
                        >
                          {formatLabel(order.paymentStatus)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Contact
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {order.customer?.email}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{order.customer?.phone}</p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Delivery
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.shippingAddress?.addressLine1}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Order
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {formatPKR(order.grandTotal)}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.items.length} item(s) | {compactDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Payment
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {formatLabel(order.paymentMethod)}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Tracking: {order.trackingNumber || "Not assigned"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <input
                        value={trackingDrafts[order._id] ?? order.trackingNumber ?? ""}
                        disabled={updatingOrderId === order._id}
                        onChange={(event) =>
                          setTrackingDrafts((current) => ({
                            ...current,
                            [order._id]: event.target.value,
                          }))
                        }
                        placeholder="Tracking number"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />

                      <div className="grid gap-3 sm:grid-cols-3">
                        <select
                          value={order.status}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) =>
                            handleUpdateOrder(order._id, { status: event.target.value })
                          }
                          className="admin-select w-full"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>

                        <select
                          value={order.paymentStatus}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) =>
                            handleUpdateOrder(order._id, {
                              paymentStatus: event.target.value,
                            })
                          }
                          className="admin-select w-full"
                        >
                          {PAYMENT_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          disabled={updatingOrderId === order._id}
                          onClick={() =>
                            handleUpdateOrder(order._id, {
                              trackingNumber: trackingDrafts[order._id] ?? "",
                            })
                          }
                          className="admin-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Save tracking
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-600">
                    Page {ordersData.pagination.page} of {ordersData.pagination.totalPages}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:flex">
                    <button
                      type="button"
                      disabled={!ordersData.pagination.hasPreviousPage}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="admin-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={!ordersData.pagination.hasNextPage}
                      onClick={() => setPage((current) => current + 1)}
                      className="admin-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FiShoppingBag size={24} />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
                No orders to manage
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Orders will appear here after customers complete checkout.
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </AdminLayout>
  );
};
