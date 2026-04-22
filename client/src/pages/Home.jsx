import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTruck,
  FiLock,
  FiCheckCircle,
  FiSmartphone,
  FiArrowRight,
  FiStar,
} from "react-icons/fi";
import { COLORS, ANIMATIONS, Z_INDEX } from "../constants/designTokens";

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
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const Home = () => {
  const features = [
    {
      title: "Fast Delivery",
      description: "Get your order within 24 hours",
      icon: FiTruck,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Secure Payment",
      description: "Safe and encrypted transactions",
      icon: FiLock,
      color: "from-green-500 to-green-600",
    },
    {
      title: "100% Authentic",
      description: "Genuine products guaranteed",
      icon: FiCheckCircle,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Phone X",
      price: 1299,
      rating: 4.8,
      reviews: 234,
    },
    { id: 2, name: "Ultra Phone Pro", price: 1599, rating: 4.9, reviews: 342 },
    { id: 3, name: "Smart Phone Plus", price: 899, rating: 4.7, reviews: 156 },
    { id: 4, name: "Elite Device", price: 999, rating: 4.6, reviews: 189 },
  ];

  return (
    <div
      className="min-h-screen pt-20 pb-24 md:pb-8"
      style={{ background: COLORS.neutral.bg }}
    >
      {/* Hero Section */}
      <motion.section
        className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${COLORS.primary.main} 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${COLORS.secondary.main} 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10">
          {/* Main Headline */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="block text-neutral-900">Discover the Latest</span>
              <span
                className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mt-2"
              >
                Mobile Technology
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Experience cutting-edge smartphones and accessories with incredible deals. Shop from the world's most trusted brands.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              to="/shop"
              className="group relative px-10 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary.dark} 0%, ${COLORS.primary.darker} 100%)`,
                }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative flex items-center gap-2">
                Start Shopping
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>

            <a
              href="#featured"
              className="px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2"
              style={{
                borderColor: COLORS.primary.main,
                color: COLORS.primary.main,
                backgroundColor: `${COLORS.primary.main}10`,
              }}
            >
              Explore Products
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "1000+", label: "Products" },
              { number: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-neutral-900">
                  {stat.number}
                </div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Cards */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16 md:py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => {
            const FeatureIcon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-2xl bg-white border border-neutral-100 overflow-hidden cursor-pointer transition-all duration-300"
                style={{
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Gradient background on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, rgba(40, 92, 204, 0.05) 0%, rgba(255, 242, 189, 0.05) 100%)`,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Icon container */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <FeatureIcon />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${COLORS.primary.main} 0%, transparent 100%)`,
                  }}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <section
        className="py-16 md:py-24"
        style={{
          background: `linear-gradient(135deg, ${COLORS.secondary.main}20 0%, ${COLORS.primary.main}10 100%)`,
        }}
        id="featured"
      >
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div
              className="inline-block px-4 py-2 rounded-full mb-4 font-semibold text-sm"
              style={{
                background: `${COLORS.primary.main}20`,
                color: COLORS.primary.main,
              }}
            >
              Premium Selection
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Featured Products
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Handpicked selection of our most popular and highly-rated devices
            </p>
          </motion.div>

          {/* Product Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-neutral-100"
                style={{
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Product Image Area */}
                <div
                  className="h-48 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.secondary.main}80 0%, ${COLORS.primary.main}20 100%)`,
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-6xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <FiSmartphone />
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="p-6 relative z-10">
                  <h3 className="font-bold text-lg text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={16}
                          style={{
                            fill: i < Math.floor(product.rating)
                              ? COLORS.primary.main
                              : "transparent",
                            color: COLORS.primary.main,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: COLORS.primary.main }}
                    >
                      ${product.price}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                      }}
                    >
                      <FiArrowRight />
                    </motion.button>
                  </div>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-16"
          >
            <Link
              to="/shop"
              className="px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                color: "white",
              }}
            >
              View All Products
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
          }}
        >
          {/* Decorative elements */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, white 0%, transparent 70%)",
            }}
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Get exclusive deals, product launches, and tech tips delivered straight to your inbox
            </p>

            <motion.form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                style={{
                  backgroundColor: "white",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-primary transition-all duration-300"
                style={{
                  background: COLORS.secondary.main,
                  color: COLORS.primary.main,
                }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};
