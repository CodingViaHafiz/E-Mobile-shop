import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCreditCard,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiShoppingCart,
  FiSmartphone,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";
import { inventoryApi } from "../services/inventory";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { formatPKR } from "../utils/currency";

const CheckoutDialog = ({
  checkoutForm,
  onChange,
  onClose,
  onSubmit,
  submitting,
}) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Complete your order
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Add shipping details, contact info, and payment method before placing the order.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
          <FiX />
        </button>
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Full name</span>
            <input
              required
              value={checkoutForm.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Email</span>
            <input
              required
              type="email"
              value={checkoutForm.email}
              onChange={(event) => onChange("email", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Phone number</span>
            <input
              required
              value={checkoutForm.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Payment method</span>
            <select
              value={checkoutForm.paymentMethod}
              onChange={(event) => onChange("paymentMethod", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="cash_on_delivery">Cash on delivery</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="easypaisa">Easypaisa</option>
              <option value="jazzcash">JazzCash</option>
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Address line 1</span>
            <input
              required
              value={checkoutForm.addressLine1}
              onChange={(event) => onChange("addressLine1", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Address line 2</span>
            <input
              value={checkoutForm.addressLine2}
              onChange={(event) => onChange("addressLine2", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">City</span>
            <input
              required
              value={checkoutForm.city}
              onChange={(event) => onChange("city", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">State / Province</span>
            <input
              required
              value={checkoutForm.state}
              onChange={(event) => onChange("state", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Postal code</span>
            <input
              required
              value={checkoutForm.postalCode}
              onChange={(event) => onChange("postalCode", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Country</span>
            <input
              required
              value={checkoutForm.country}
              onChange={(event) => onChange("country", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Order notes</span>
          <textarea
            rows="4"
            value={checkoutForm.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Apartment, delivery instructions, preferred contact time..."
          />
        </label>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiCreditCard />
            {submitting ? "Placing order..." : "Confirm order"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    grandTotal,
    submitting,
    checkout,
    removeFromCart,
    syncProduct,
    updateQuantity,
  } = useCart();
  const [syncing, setSyncing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });

  useEffect(() => {
    setCheckoutForm((current) => ({
      ...current,
      fullName: current.fullName || user?.name || "",
      email: current.email || user?.email || "",
    }));
  }, [user]);

  const refreshProducts = async () => {
    if (items.length === 0) {
      return;
    }

    setSyncing(true);

    try {
      const results = await Promise.allSettled(
        items.map((item) => inventoryApi.getProductById(item.productId)),
      );

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          syncProduct(result.value.product);
        }
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [items, syncProduct]);

  const hasUnavailableItems = items.some((item) => item.stock === 0);

  const handleCheckoutFieldChange = (field, value) => {
    setCheckoutForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div
      className="min-h-screen pb-24 pt-20 md:pb-8"
      style={{ background: COLORS.neutral.bg }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl md:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Live Cart
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
                Review your order
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Checkout triggers a backend order and deducts stock through the same
                inventory service used by the admin panel.
              </p>
            </div>
            <button
              type="button"
              disabled={syncing}
              onClick={refreshProducts}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition"
            >
              <FiRefreshCw className={syncing ? "animate-spin" : ""} />
              Refresh stock
            </button>
          </div>
        </motion.div>

        {feedback && (
          <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {feedback}
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-slate-50 to-amber-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiSmartphone className="text-4xl text-blue-700/70" />
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-lg font-black tracking-tight text-slate-950 transition hover:text-blue-700"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.brand} {item.model}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        Stock available: {item.stock}
                      </p>
                    </div>

                    <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
                      >
                        <FiMinus />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-950">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.stock}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">Item total</p>
                      <p className="mt-1 text-2xl font-black text-slate-950">
                        {formatPKR(item.price * item.quantity)}
                      </p>
                      <p className="mt-1 text-xs uppercase text-slate-500">
                        PTA: {item.ptaStatus === "yes" ? "Approved" : "No"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-100 bg-white text-red-600 transition hover:bg-red-50"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-fit rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
            >
              <div className="rounded-[28px] bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                  Order summary
                </p>
                <p className="mt-3 text-3xl font-black">{itemCount} items</p>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {formatPKR(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base">
                  <span className="font-semibold text-slate-900">Grand total</span>
                  <span className="text-2xl font-black text-slate-950">
                    {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              {hasUnavailableItems && (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  One or more items are out of stock. Remove them before checkout.
                </div>
              )}

              {!isAuthenticated && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  Sign in before checkout so your order history and status updates are saved to your account.
                </div>
              )}

              <button
                type="button"
                disabled={submitting || hasUnavailableItems}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }

                  setCheckoutOpen(true);
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiShoppingCart />
                {isAuthenticated ? "Place Order" : "Login to Checkout"}
              </button>

              <Link
                to="/shop"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition"
              >
                Continue shopping
                <FiArrowRight />
              </Link>
            </motion.aside>
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
              <FiShoppingCart size={28} />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Browse the live inventory and add products to start an order.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Start shopping
              <FiArrowRight />
            </Link>
          </div>
        )}
      </div>

      {checkoutOpen && (
        <CheckoutDialog
          checkoutForm={checkoutForm}
          onChange={handleCheckoutFieldChange}
          onClose={() => setCheckoutOpen(false)}
          submitting={submitting}
          onSubmit={async (event) => {
            event.preventDefault();

            const result = await checkout({
              customer: {
                fullName: checkoutForm.fullName,
                email: checkoutForm.email,
                phone: checkoutForm.phone,
              },
              shippingAddress: {
                addressLine1: checkoutForm.addressLine1,
                addressLine2: checkoutForm.addressLine2,
                city: checkoutForm.city,
                state: checkoutForm.state,
                postalCode: checkoutForm.postalCode,
                country: checkoutForm.country,
              },
              paymentMethod: checkoutForm.paymentMethod,
              notes: checkoutForm.notes,
            });

            setFeedback(
              result.success && result.order?.orderNumber
                ? `${result.message}. Order number: ${result.order.orderNumber}`
                : result.message,
            );

            if (result.success) {
              setCheckoutOpen(false);
              setCheckoutForm((current) => ({
                ...current,
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                postalCode: "",
                notes: "",
                paymentMethod: "cash_on_delivery",
              }));
            }
          }}
        />
      )}
    </div>
  );
};
