import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiShoppingCart,
  FiSmartphone,
  FiTruck,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";
import { inventoryApi } from "../services/inventory";
import { useCart } from "../store/CartContext";
import { formatPKR } from "../utils/currency";
import { Footer } from "../components/Footer";

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

const getStockTone = (product) => {
  if (product.stock === 0) {
    return "bg-red-50 text-red-700";
  }

  if (product.stock <= product.lowStockThreshold) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-emerald-50 text-emerald-700";
};

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [feedback, setFeedback] = useState("");
  const { addToCart, syncProducts } = useCart();

  useEffect(() => {
    let ignore = false;

    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const data = await inventoryApi.getProducts({
          page: 1,
          limit: 4,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        if (ignore) {
          return;
        }

        setFeaturedProducts(data.products || []);
        setTotalProducts(data.pagination?.total || 0);
        syncProducts(data.products || []);
      } catch (error) {
        if (!ignore) {
          setProductsError(
            error?.response?.data?.message || "Failed to load featured products",
          );
        }
      } finally {
        if (!ignore) {
          setLoadingProducts(false);
        }
      }
    };

    fetchFeaturedProducts();

    return () => {
      ignore = true;
    };
  }, [syncProducts]);

  const features = [
    {
      title: "Fast Delivery",
      description: "Get your order within 3 working days",
      icon: FiTruck,
    },
    {
      title: "Secure Payment",
      description: "Safe and encrypted transactions",
      icon: FiLock,
    },
    {
      title: "100% Authentic",
      description: "Genuine products guaranteed",
      icon: FiCheckCircle,
    },
  ];

  const stats = [
    { number: `${totalProducts || 0}+`, label: "Live Products" },
    { number: featuredProducts.filter((product) => product.stock > 0).length, label: "Ready To Ship" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div
      className="min-h-screen pb-24 pt-10 md:pb-8"
      style={{ background: COLORS.neutral.bg }}
    >
      <motion.section
        className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 md:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-40 -top-40 h-80 w-80 rounded-full opacity-10"
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
            className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full opacity-5"
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
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
              <span className="block text-neutral-900">Discover Live</span>
              <span className="mt-2 block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Mobile Inventory
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl">
              The storefront now pulls active products directly from the backend, so
              customers always see the latest stock and pricing.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/shop"
              className="group relative overflow-hidden rounded-2xl px-10 py-4 text-lg font-bold text-white transition-all duration-300"
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
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>

            <a
              href="#featured"
              className="rounded-2xl border-2 px-10 py-4 text-lg font-bold transition-all duration-300"
              style={{
                borderColor: COLORS.primary.main,
                color: COLORS.primary.main,
                backgroundColor: `${COLORS.primary.main}10`,
              }}
            >
              Explore Products
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mx-auto grid max-w-2xl grid-cols-3 gap-4 md:gap-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-neutral-900 md:text-3xl">
                  {stat.number}
                </div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-7xl px-4 py-16 md:py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300"
                style={{
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(135deg, rgba(40, 92, 204, 0.05) 0%, rgba(255, 242, 189, 0.05) 100%)",
                  }}
                  transition={{ duration: 0.3 }}
                />

                <div
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <FeatureIcon />
                </div>

                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <section
        className="py-16 md:py-24"
        style={{
          background: `linear-gradient(135deg, ${COLORS.secondary.main}20 0%, ${COLORS.primary.main}10 100%)`,
        }}
        id="featured"
      >
        <motion.div
          className="mx-auto max-w-7xl px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <div
              className="mb-4 inline-block rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                background: `${COLORS.primary.main}20`,
                color: COLORS.primary.main,
              }}
            >
              Live Featured Products
            </div>
            <h2 className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl">
              Newest Active Inventory
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              This section now reflects the latest active products added from the admin panel.
            </p>
          </motion.div>

          {feedback && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {feedback}
            </div>
          )}

          {productsError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {productsError}
            </div>
          )}

          {loadingProducts ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[340px] animate-pulse rounded-2xl border border-neutral-100 bg-white"
                />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300"
                  style={{
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <div
                      className="relative flex h-48 items-center justify-center overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.secondary.main}80 0%, ${COLORS.primary.main}20 100%)`,
                      }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="text-6xl opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                        >
                          <FiSmartphone />
                        </motion.div>
                      )}

                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${getStockTone(product)}`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </Link>

                  <div className="relative z-10 p-6">
                    <div className="mb-2 text-xs font-semibold" style={{ color: COLORS.primary.main }}>
                      {product.brand}
                    </div>

                    <Link
                      to={`/product/${product._id}`}
                      className="mb-3 block text-lg font-bold text-neutral-900 transition-colors duration-300 group-hover:text-blue-600"
                    >
                      {product.name}
                    </Link>

                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                        {product.condition}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${product.ptaStatus === "yes" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                      >
                        PTA {product.ptaStatus === "yes" ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: COLORS.primary.main }}
                      >
                        {formatPKR(product.price)}
                      </span>
                      <button
                        type="button"
                        disabled={product.stock === 0}
                        onClick={() => {
                          const result = addToCart(product, 1);
                          setFeedback(result.message);
                        }}
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white transition-all duration-300 ${product.stock === 0
                          ? "cursor-not-allowed bg-slate-300"
                          : ""
                          }`}
                        style={
                          product.stock === 0
                            ? undefined
                            : {
                              background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                            }
                        }
                      >
                        <FiShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
              <h3 className="text-2xl font-bold text-neutral-900">No active products yet</h3>
              <p className="mt-3 text-neutral-600">
                Add products from the admin inventory page and they will appear here automatically.
              </p>
            </div>
          )}

          <motion.div variants={itemVariants} className="mt-16 flex justify-center">
            <Link
              to="/shop"
              className="rounded-2xl px-10 py-4 text-lg font-bold text-white transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
              }}
            >
              View All Products
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className="mx-auto max-w-7xl px-4 py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="relative overflow-hidden rounded-3xl p-12 text-center md:p-16"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
          }}
        >
          <motion.div
            className="absolute right-0 top-0 h-96 w-96 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, white 0%, transparent 70%)",
            }}
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Subscribe to Our Newsletter
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
              Get exclusive deals, product launches, and tech tips delivered straight to your inbox.
            </p>

            <motion.form
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border-0 px-6 py-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{
                  backgroundColor: "white",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl px-8 py-4 font-bold transition-all duration-300"
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
      <div className="mt-16 mb-[-30px]">
        <Footer />
      </div>
    </div>

  );
};
