import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiBox,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiSearch,
  FiShoppingCart,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { inventoryApi } from "../services/inventory";
import { useCart } from "../store/CartContext";
import { formatPKR } from "../utils/currency";

const resolveSort = (sortBy) => {
  switch (sortBy) {
    case "price-low":
      return { sortBy: "price", sortOrder: "asc" };
    case "price-high":
      return { sortBy: "price", sortOrder: "desc" };
    case "name":
      return { sortBy: "name", sortOrder: "asc" };
    case "stock":
      return { sortBy: "stock", sortOrder: "desc" };
    default:
      return { sortBy: "createdAt", sortOrder: "desc" };
  }
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

const getReviewLabel = (product) =>
  product?.reviewCount
    ? `${product.averageRating} / 5 (${product.reviewCount})`
    : "No reviews";

const getCompareLabel = (product) =>
  product ? `${product.name} | ${product.brand} ${product.model}` : "";

export const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const [catalog, setCatalog] = useState({
    products: [],
    pagination: { page: 1, totalPages: 1, total: 0 },
    filters: { brands: [], categories: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [compareOptions, setCompareOptions] = useState([]);
  const [compareFirstQuery, setCompareFirstQuery] = useState("");
  const [compareSecondQuery, setCompareSecondQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 450);
  const { addToCart, syncProducts } = useCart();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedBrand, selectedCategory, selectedCondition, sortBy]);

  useEffect(() => {
    let ignore = false;

    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError("");

        const sortOptions = resolveSort(sortBy);
        const data = await inventoryApi.getProducts({
          search: debouncedSearch,
          brand: selectedBrand,
          category: selectedCategory,
          condition: selectedCondition,
          page,
          limit: 8,
          ...sortOptions,
        });

        if (ignore) {
          return;
        }

        setCatalog(data);
        syncProducts(data.products || []);
      } catch (requestError) {
        if (ignore) {
          return;
        }

        setError(
          requestError?.response?.data?.message || "Failed to load products",
        );
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchCatalog();

    return () => {
      ignore = true;
    };
  }, [
    debouncedSearch,
    page,
    selectedBrand,
    selectedCategory,
    selectedCondition,
    sortBy,
    syncProducts,
  ]);

  useEffect(() => {
    let ignore = false;

    const fetchCompareOptions = async () => {
      try {
        const data = await inventoryApi.getProducts({
          page: 1,
          limit: 50,
          sortBy: "name",
          sortOrder: "asc",
        });

        if (!ignore) {
          setCompareOptions(data.products || []);
        }
      } catch {
        if (!ignore) {
          setCompareOptions([]);
        }
      }
    };

    fetchCompareOptions();

    return () => {
      ignore = true;
    };
  }, []);

  const firstCompareProduct = useMemo(
    () =>
      compareOptions.find((product) => getCompareLabel(product) === compareFirstQuery),
    [compareFirstQuery, compareOptions],
  );

  const secondCompareOptions = useMemo(() => {
    if (!firstCompareProduct) {
      return compareOptions;
    }

    return compareOptions.filter(
      (product) =>
        product._id !== firstCompareProduct._id &&
        product.category === firstCompareProduct.category,
    );
  }, [compareOptions, firstCompareProduct]);

  const secondCompareProduct = useMemo(
    () =>
      secondCompareOptions.find(
        (product) => getCompareLabel(product) === compareSecondQuery,
      ),
    [compareSecondQuery, secondCompareOptions],
  );

  useEffect(() => {
    if (!firstCompareProduct || !compareSecondQuery) {
      return;
    }

    const stillValid = secondCompareOptions.some(
      (product) => getCompareLabel(product) === compareSecondQuery,
    );

    if (!stillValid) {
      setCompareSecondQuery("");
    }
  }, [compareSecondQuery, firstCompareProduct, secondCompareOptions]);

  const comparisonRows = [
    { label: "Brand", getValue: (product) => product?.brand || "-" },
    { label: "Model", getValue: (product) => product?.model || "-" },
    { label: "Category", getValue: (product) => product?.category || "-" },
    { label: "Condition", getValue: (product) => product?.condition || "-" },
    { label: "Price", getValue: (product) => (product ? formatPKR(product.price) : "-") },
    { label: "Stock", getValue: (product) => (product ? `${product.stock} units` : "-") },
    {
      label: "PTA",
      getValue: (product) =>
        product ? (product.ptaStatus === "yes" ? "Approved" : "No") : "-",
    },
    {
      label: "Battery",
      getValue: (product) =>
        product?.batteryHealth !== null && product?.batteryHealth !== undefined
          ? `${product.batteryHealth}%`
          : "N/A",
    },
    { label: "Rating", getValue: getReviewLabel },
  ];

  const renderCompareProduct = (product, fallback) => (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 p-3 text-white">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white/95">
        {product?.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <FiSmartphone className="text-5xl text-blue-700/70" />
        )}
      </div>
      <p className="mt-3 truncate text-sm font-black">
        {product?.name || fallback}
      </p>
      <p className="mt-1 truncate text-xs text-blue-100">
        {product ? `${product.brand} ${product.model}` : "Select a product"}
      </p>
      <p className="mt-2 text-base font-black text-white">
        {product ? formatPKR(product.price) : "-"}
      </p>
    </div>
  );

  return (
    <div
      className="min-h-screen pb-24 pt-20 md:pb-8"
      style={{ background: COLORS.neutral.bg }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.section
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl md:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Live Catalog
              </p>
              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Shop inventory with live stock
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Products here are fetched from the backend, filtered with debounced
                search, and updated with real stock counts so unavailable items cannot
                be added to the cart.
              </p>
            </div>

            <div className="rounded-[28px] bg-white p-5 text-slate-900 shadow-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                Results
              </p>
              <p className="mt-3 text-3xl font-black">
                {catalog.pagination?.total || 0}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Active products currently available in the storefront.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-6 overflow-hidden rounded-[24px] border border-neutral-100 bg-white p-6 shadow-md"
        >
          <div className="grid gap-4 p-2 lg:grid-cols-[1fr_0.6fr] lg:items-center lg:p-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Compare devices</h2>
              <p className="mt-2 text-sm text-slate-600">Compare two devices side-by-side on a dedicated page.</p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-95"
              >
                <FiBarChart2 />
                Compare devices
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[280px_1fr]">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-fit rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <FiFilter size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">Filters</h2>
                <p className="text-sm text-slate-500">Refine live inventory</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  Search
                </span>
                <div className="relative">
                  <FiSearch
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Name, brand, model..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  Brand
                </span>
                <select
                  value={selectedBrand}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="all">All brands</option>
                  {catalog.filters?.brands?.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  Category
                </span>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="all">All categories</option>
                  {catalog.filters?.categories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  Condition
                </span>
                <select
                  value={selectedCondition}
                  onChange={(event) => setSelectedCondition(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="all">All conditions</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  Sort by
                </span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="featured">Newest first</option>
                  <option value="price-low">Price low to high</option>
                  <option value="price-high">Price high to low</option>
                  <option value="name">Name A-Z</option>
                  <option value="stock">Most stock</option>
                </select>
              </label>
            </div>
          </motion.aside>

          <div className="space-y-5">
            {feedback && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {feedback}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[360px] animate-pulse rounded-[28px] border border-white/60 bg-white/70 shadow-xl shadow-slate-900/5"
                  />
                ))}
              </div>
            ) : catalog.products?.length > 0 ? (
              <>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {catalog.products.map((product) => (
                    <motion.article
                      key={product._id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="overflow-hidden rounded-[28px] border border-white/60 bg-white/85 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
                    >
                      <Link to={`/product/${product._id}`} className="block">
                        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-slate-50 to-amber-50">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiSmartphone className="text-7xl text-blue-700/70" />
                          )}

                          <span
                            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${getStockTone(product)}`}
                          >
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </span>
                        </div>
                      </Link>

                      <div className="space-y-4 p-5">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {product.brand}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {product.condition}
                          </span>
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            {product.category}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${product.ptaStatus === "yes"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                              }`}
                          >
                            PTA {product.ptaStatus === "yes" ? "Yes" : "No"}
                          </span>
                        </div>

                        <div>
                          <Link
                            to={`/product/${product._id}`}
                            className="text-xl font-black tracking-tight text-slate-950 transition hover:text-blue-700"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-1 text-sm text-slate-500">
                            {product.brand} {product.model}
                          </p>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                            {product.description || "No description available for this product yet."}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Price
                              </p>
                              <p className="mt-2 text-3xl font-black text-slate-950">
                                {formatPKR(product.price)}
                              </p>
                            </div>
                            <div className="text-right text-sm text-slate-500">
                              <p>PTA</p>
                              <p className="mt-1 font-semibold uppercase text-slate-700">
                                {product.ptaStatus === "yes" ? "Approved" : "No"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={product.stock === 0}
                          onClick={() => {
                            const result = addToCart(product, 1);
                            setFeedback(result.message);
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${product.stock === 0
                            ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                            : "bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:-translate-y-0.5 hover:bg-slate-900"
                            }`}
                        >
                          <FiShoppingCart />
                          {product.stock === 0 ? "Unavailable" : "Add to Cart"}
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <div className="flex flex-col gap-3 rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-600">
                    Page {catalog.pagination.page} of {catalog.pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!catalog.pagination.hasPreviousPage}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiChevronLeft />
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={!catalog.pagination.hasNextPage}
                      onClick={() => setPage((current) => current + 1)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
                  <FiBox size={28} />
                </div>
                <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
                  No products match these filters
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Try a broader search or switch back to all categories and brands.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
