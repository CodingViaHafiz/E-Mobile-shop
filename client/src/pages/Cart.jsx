import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSmartphone,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiArrowRight,
  FiCheck,
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

export const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999,
      quantity: 1,
      image: "FiSmartphone",
    },
    {
      id: 2,
      name: "Samsung S24 Ultra",
      price: 1199,
      quantity: 1,
      image: "FiSmartphone",
    },
  ]);

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      removeItem(id);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8" style={{ background: COLORS.neutral.bg }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-neutral-600 text-lg">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in cart
          </p>
        </motion.div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              className="lg:col-span-2 space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                    className="bg-white rounded-2xl border-2 border-neutral-100 p-6 hover:border-blue-600 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      {/* Product Image */}
                      <div
                        className="w-24 h-24 rounded-xl flex items-center justify-center text-4xl flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.secondary.main}80 0%, ${COLORS.primary.main}20 100%)`,
                        }}
                      >
                        <FiSmartphone />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">
                          {item.name}
                        </h3>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: COLORS.primary.main }}
                        >
                          ${item.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-neutral-100 rounded-xl p-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors duration-300"
                        >
                          <FiMinus size={18} />
                        </motion.button>
                        <span className="w-8 text-center font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors duration-300"
                        >
                          <FiPlus size={18} />
                        </motion.button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-sm text-neutral-600 mb-1">Subtotal</p>
                        <p className="text-2xl font-bold text-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-all duration-300"
                      >
                        <FiTrash2 size={20} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl border-2 border-neutral-100 p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Order Summary
                </h2>

                {/* Summary Items */}
                <div className="space-y-3 mb-6 pb-6 border-b-2 border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 font-medium">Subtotal</span>
                    <span className="font-bold text-neutral-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 font-medium">Shipping</span>
                    <span className="font-bold text-neutral-900">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 font-medium">Tax</span>
                    <span className="font-bold text-neutral-900">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-8 p-4 rounded-xl" style={{
                  background: `${COLORS.secondary.main}60`,
                }}>
                  <span className="text-lg font-bold text-neutral-900">Total</span>
                  <span className="text-3xl font-bold text-neutral-900">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <FiShoppingCart size={20} />
                  Proceed to Checkout
                </motion.button>

                {/* Continue Shopping */}
                <Link
                  to="/shop"
                  className="w-full py-3 rounded-xl font-bold text-lg text-center transition-all duration-300 border-2"
                  style={{
                    borderColor: COLORS.primary.main,
                    color: COLORS.primary.main,
                    backgroundColor: `${COLORS.primary.main}10`,
                  }}
                >
                  Continue Shopping
                </Link>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t-2 border-neutral-200">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-blue-600 focus:outline-none transition-colors duration-300 mb-2"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full py-2 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-all duration-300"
                  >
                    Apply Code
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <FiCheck size={16} style={{ color: COLORS.primary.main }} />
                    Secure checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck size={16} style={{ color: COLORS.primary.main }} />
                    Fast shipping
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck size={16} style={{ color: COLORS.primary.main }} />
                    Easy returns
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-neutral-100 p-16 text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: `${COLORS.primary.main}20`,
              }}
            >
              <FiShoppingCart size={40} style={{ color: COLORS.primary.main }} />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-neutral-600 text-lg mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
              }}
            >
              Start Shopping
              <FiArrowRight size={20} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};
