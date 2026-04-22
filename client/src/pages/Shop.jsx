import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiSmartphone,
  FiStar,
  FiFilter,
  FiX,
  FiChevronDown,
  FiShoppingCart,
} from "react-icons/fi";
import { COLORS, ANIMATIONS, Z_INDEX } from "../constants/designTokens";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999,
    category: "Apple",
    rating: 4.8,
    reviews: 320,
  },
  {
    id: 2,
    name: "Samsung S24 Ultra",
    price: 1199,
    category: "Samsung",
    rating: 4.7,
    reviews: 280,
  },
  {
    id: 3,
    name: "Google Pixel 8",
    price: 799,
    category: "Google",
    rating: 4.6,
    reviews: 215,
  },
  {
    id: 4,
    name: "OnePlus 12",
    price: 799,
    category: "OnePlus",
    rating: 4.5,
    reviews: 186,
  },
  {
    id: 5,
    name: "Xiaomi 14 Ultra",
    price: 849,
    category: "Xiaomi",
    rating: 4.4,
    reviews: 142,
  },
  {
    id: 6,
    name: "Nothing Phone 2",
    price: 599,
    category: "Nothing",
    rating: 4.3,
    reviews: 118,
  },
  {
    id: 7,
    name: "Motorola Edge 50",
    price: 499,
    category: "Motorola",
    rating: 4.2,
    reviews: 95,
  },
  {
    id: 8,
    name: "Realme 12 Pro",
    price: 449,
    category: "Realme",
    rating: 4.1,
    reviews: 87,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

export const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Apple",
    "Samsung",
    "Google",
    "OnePlus",
    "Xiaomi",
    "Motorola",
    "Nothing",
    "Realme",
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    result = result.filter((p) => p.rating >= minRating);

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy, priceRange, minRating]);

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
            Discover Products
          </h1>
          <p className="text-neutral-600 text-lg">
            {filteredProducts.length} products available
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Search Bar */}
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-blue-600 focus:outline-none transition-colors duration-300 bg-white"
              style={{
                borderColor: searchQuery ? COLORS.primary.main : undefined,
              }}
            />
          </div>

          {/* Filter and Sort Row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-3 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-neutral-200 font-medium transition-all duration-300 hover:border-blue-600"
                style={{
                  borderColor: showFilters ? COLORS.primary.main : undefined,
                  color: showFilters ? COLORS.primary.main : COLORS.neutral.text,
                }}
              >
                <FiFilter size={18} />
                Filters
              </motion.button>

              {/* Category Badges (Mobile - horizontal scroll, Desktop - inline) */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.slice(0, 4).map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowFilters(false);
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 border-2"
                    style={{
                      background:
                        selectedCategory === cat
                          ? `${COLORS.primary.main}20`
                          : "transparent",
                      borderColor:
                        selectedCategory === cat
                          ? COLORS.primary.main
                          : COLORS.neutral.border,
                      color:
                        selectedCategory === cat
                          ? COLORS.primary.main
                          : COLORS.neutral.text,
                    }}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-48 px-4 py-2 rounded-xl border-2 border-neutral-200 focus:border-blue-600 focus:outline-none transition-colors duration-300 appearance-none bg-white cursor-pointer font-medium"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <FiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </motion.div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 rounded-2xl bg-white border-2 border-neutral-200 p-6 overflow-hidden"
            >
              <div className="space-y-6">
                {/* All Categories */}
                <div>
                  <h3 className="font-bold text-neutral-900 mb-4">
                    All Categories
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border-2"
                        style={{
                          background:
                            selectedCategory === cat
                              ? `${COLORS.primary.main}20`
                              : "transparent",
                          borderColor:
                            selectedCategory === cat
                              ? COLORS.primary.main
                              : COLORS.neutral.border,
                          color:
                            selectedCategory === cat
                              ? COLORS.primary.main
                              : COLORS.neutral.text,
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-bold text-neutral-900 mb-4">
                    Price Range
                  </h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1500"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="flex-1 h-2 rounded-lg"
                      style={{
                        background: `linear-gradient(to right, ${COLORS.primary.main} 0%, ${COLORS.primary.main} 100%)`,
                      }}
                    />
                    <div className="text-right whitespace-nowrap">
                      <div className="text-sm text-neutral-600">
                        ${priceRange[0]} - ${priceRange[1]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <h3 className="font-bold text-neutral-900 mb-4">
                    Minimum Rating
                  </h3>
                  <div className="flex gap-2">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border-2"
                        style={{
                          background:
                            minRating === rating
                              ? `${COLORS.primary.main}20`
                              : "transparent",
                          borderColor:
                            minRating === rating
                              ? COLORS.primary.main
                              : COLORS.neutral.border,
                          color:
                            minRating === rating
                              ? COLORS.primary.main
                              : COLORS.neutral.text,
                        }}
                      >
                        {rating === 0 ? "All" : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSortBy("featured");
                    setPriceRange([0, 1500]);
                    setMinRating(0);
                    setShowFilters(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border-2"
                  style={{
                    borderColor: COLORS.primary.main,
                    color: COLORS.primary.main,
                    background: `${COLORS.primary.main}10`,
                  }}
                >
                  Clear All Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key="products-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
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

                    {/* Sale Badge */}
                    <motion.div
                      className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                      }}
                    >
                      New
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 relative z-10">
                    {/* Brand */}
                    <div
                      className="text-xs font-semibold mb-2"
                      style={{ color: COLORS.primary.main }}
                    >
                      {product.category}
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-lg text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={14}
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
                      <span className="text-xs text-neutral-600">
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
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                        }}
                      >
                        <FiShoppingCart size={18} />
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
          ) : (
            <motion.div
              key="no-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full mb-6 flex items-center justify-center" style={{ background: `${COLORS.primary.main}20` }}>
                <FiSmartphone size={40} style={{ color: COLORS.primary.main }} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                No Products Found
              </h3>
              <p className="text-neutral-600 mb-6">
                Try adjusting your filters or search terms
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSortBy("featured");
                  setPriceRange([0, 1500]);
                  setMinRating(0);
                }}
                className="px-6 py-2 rounded-xl font-medium transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  color: "white",
                }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
