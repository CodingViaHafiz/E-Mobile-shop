import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiSmartphone,
  FiStar,
  FiTruck,
  // FiShieldCheck,
  FiRotateCcw,
  FiShoppingCart,
  FiHeart,
  FiShare2,
} from "react-icons/fi";
import { COLORS, ANIMATIONS } from "../constants/designTokens";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export const ProductDetail = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("midnight");
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock product data
  const product = {
    id: 1,
    name: "Premium iPhone 15 Pro",
    brand: "Apple",
    price: 999,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 2341,
    description:
      "Experience the ultimate smartphone with cutting-edge technology, stunning display, and professional-grade camera system.",
    specs: [
      { label: "Display", value: "6.1\" Super Retina XDR" },
      { label: "Processor", value: "A17 Pro Chip" },
      { label: "Camera", value: "48MP Main + 12MP Ultra Wide" },
      { label: "Battery", value: "Up to 20 hours video playback" },
      { label: "RAM", value: "8GB" },
      { label: "Storage", value: "256GB" },
    ],
    colors: [
      { name: "Midnight", code: "#000000", id: "midnight" },
      { name: "Silver", code: "#E8E8E8", id: "silver" },
      { name: "Gold", code: "#FFD700", id: "gold" },
      { name: "Deep Purple", code: "#3A0066", id: "purple" },
    ],
    inStock: true,
    highlights: [
      "Fast Delivery within 24 hours",
      "Secure & Encrypted Payment",
      "100% Authentic Product",
      "30-Day Money Back Guarantee",
    ],
  };

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8" style={{ background: COLORS.neutral.bg }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium mb-8 transition-colors duration-300"
        >
          <FiArrowLeft size={20} />
          Back to Products
        </motion.button>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Product Image Section */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            {/* Main Image */}
            <div
              className="w-full h-96 md:h-[500px] rounded-3xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${COLORS.secondary.main}80 0%, ${COLORS.primary.main}20 100%)`,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="text-8xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              >
                <FiSmartphone />
              </motion.div>

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <motion.div
                  className="absolute top-6 right-6 px-4 py-2 rounded-full text-white font-bold text-lg"
                  style={{
                    background: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  -{discountPercentage}%
                </motion.div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3">
              {["Midnight", "Silver", "Gold", "Purple"].map((color, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 rounded-2xl border-2 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.secondary.main}60 0%, ${COLORS.primary.main}20 100%)`,
                    borderColor:
                      idx === 0 ? COLORS.primary.main : COLORS.neutral.border,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div variants={itemVariants} className="flex flex-col justify-between">
            {/* Brand and Title */}
            <div className="mb-6">
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4"
                style={{
                  background: `${COLORS.primary.main}20`,
                  color: COLORS.primary.main,
                }}
              >
                {product.brand}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={20}
                      style={{
                        fill:
                          i < Math.floor(product.rating)
                            ? COLORS.primary.main
                            : "transparent",
                        color: COLORS.primary.main,
                      }}
                    />
                  ))}
                </div>
                <span className="text-neutral-600 font-medium">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-neutral-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <motion.div
              className="mb-8 p-6 rounded-2xl border-2 border-neutral-200"
              style={{
                background: `${COLORS.secondary.main}40`,
                borderColor: COLORS.secondary.main,
              }}
            >
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-neutral-900">
                  ${product.price}
                </span>
                <span className="text-xl text-neutral-500 line-through">
                  ${product.originalPrice}
                </span>
              </div>
              <p className="text-neutral-600 font-medium">
                Save ${product.originalPrice - product.price} ({discountPercentage}% off)
              </p>
            </motion.div>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="font-bold text-neutral-900 mb-4">Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full border-3 transition-all duration-300 flex items-center justify-center"
                    style={{
                      backgroundColor: color.code,
                      borderColor:
                        selectedColor === color.id
                          ? COLORS.primary.main
                          : COLORS.neutral.border,
                      boxShadow:
                        selectedColor === color.id
                          ? `0 0 0 3px ${COLORS.primary.main}40`
                          : "none",
                    }}
                    title={color.name}
                  >
                    {selectedColor === color.id && (
                      <FiShoppingCart size={20} style={{ color: color.code === "#FFFFFF" || color.code === "#FFD700" ? "#000" : "#fff" }} />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-8">
              <h3 className="font-bold text-neutral-900 mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border-2 border-neutral-200 flex items-center justify-center font-bold text-lg transition-colors duration-300 hover:border-blue-600"
                >
                  −
                </motion.button>
                <span className="w-12 text-center text-lg font-bold">
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg border-2 border-neutral-200 flex items-center justify-center font-bold text-lg transition-colors duration-300 hover:border-blue-600"
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                }}
              >
                <FiShoppingCart size={20} />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: isFavorite
                    ? "#ef4444"
                    : COLORS.neutral.border,
                  background: isFavorite ? "#ef444420" : "transparent",
                }}
              >
                <FiHeart
                  size={24}
                  style={{
                    fill: isFavorite ? "#ef4444" : "none",
                    color: isFavorite ? "#ef4444" : COLORS.neutral.textLight,
                  }}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 hover:border-blue-600"
                style={{
                  borderColor: COLORS.neutral.border,
                }}
              >
                <FiShare2 size={24} style={{ color: COLORS.neutral.textLight }} />
              </motion.button>
            </div>

            {/* In Stock Status */}
            {product.inStock && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-green-600 font-semibold mb-8"
              >
                <div className="w-3 h-3 rounded-full bg-green-600" />
                In Stock - Ships within 24 hours
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Specifications Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Specifications
          </h2>
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {product.specs.map((spec, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 border-b border-r border-neutral-200 last:border-r-0 md:last:border-r-0"
                  style={{
                    borderColor: idx % 2 === 0 ? COLORS.neutral.border : undefined,
                  }}
                  whileHover={{ backgroundColor: `${COLORS.primary.main}05` }}
                >
                  <p className="text-neutral-600 font-medium mb-2">{spec.label}</p>
                  <p className="text-lg font-bold text-neutral-900">{spec.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Highlights Section */}
        <motion.section
          className="bg-white rounded-2xl border border-neutral-200 p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.highlights.map((highlight, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  {idx === 0 && <FiTruck size={20} />}
                  {idx === 1 && <FiShieldCheck size={20} />}
                  {idx === 2 && <FiStar size={20} />}
                  {idx === 3 && <FiRotateCcw size={20} />}
                </div>
                <p className="text-neutral-700 font-medium leading-relaxed">
                  {highlight}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};
