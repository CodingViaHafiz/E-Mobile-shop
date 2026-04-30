import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiBatteryCharging,
  FiCheckCircle,
  FiInfo,
  FiShoppingCart,
  FiSmartphone,
  FiStar,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";
import { inventoryApi } from "../services/inventory";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { formatPKR } from "../utils/currency";

const getBadgeTone = (product) => {
  if (!product || product.stock === 0) {
    return "bg-red-50 text-red-700 ring-red-100";
  }

  if (product.stock <= product.lowStockThreshold) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  return "bg-emerald-50 text-emerald-700 ring-emerald-100";
};

const getReviewLabel = (product) =>
  product.reviewCount
    ? `${product.averageRating} / 5 (${product.reviewCount})`
    : "No reviews";

const specCardClass =
  "rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm shadow-slate-900/5";

export const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [reviewPermissions, setReviewPermissions] = useState({
    canReview: false,
    hasPurchased: false,
    hasReviewed: false,
  });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const { addToCart, syncProduct } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await inventoryApi.getProductById(id);

        if (ignore) {
          return;
        }

        setProduct(data.product);
        setActiveImageIndex(0);
        setReviewPermissions(
          data.reviewPermissions || {
            canReview: false,
            hasPurchased: false,
            hasReviewed: false,
          },
        );
        syncProduct(data.product);
      } catch (requestError) {
        if (!ignore) {
          setError(
            requestError?.response?.data?.message || "Failed to load product",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [id, syncProduct]);

  useEffect(() => {
    if (!product) {
      return;
    }

    setQuantity((current) => Math.min(Math.max(current, 1), Math.max(product.stock, 1)));
  }, [product]);

  const galleryImages = product?.images?.length ? product.images : [];
  const activeImage = galleryImages[activeImageIndex];

  const detailRows = useMemo(() => {
    if (!product) {
      return [];
    }

    return [
      { label: "Brand", value: product.brand },
      { label: "Model", value: product.model },
      { label: "Category", value: product.category },
      { label: "Condition", value: product.condition },
      { label: "Status", value: product.status },
      { label: "Stock", value: `${product.stock} units` },
      { label: "PTA", value: product.ptaStatus === "yes" ? "Approved" : "No" },
      ...(product.batteryHealth !== null && product.batteryHealth !== undefined
        ? [{ label: "Battery health", value: `${product.batteryHealth}%` }]
        : []),
    ];
  }, [product]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    try {
      setReviewLoading(true);
      setFeedback("");
      const data = await inventoryApi.createProductReview(product._id, reviewForm);
      setProduct(data.product);
      setReviewPermissions(
        data.reviewPermissions || {
          canReview: false,
          hasPurchased: true,
          hasReviewed: true,
        },
      );
      setReviewForm({ rating: 5, comment: "" });
      setFeedback(data.message || "Review submitted successfully");
    } catch (requestError) {
      setFeedback(
        requestError?.response?.data?.message || "Failed to submit review",
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center pt-20"
        style={{ background: COLORS.neutral.bg }}
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="min-h-screen px-4 pb-24 pt-24"
        style={{ background: COLORS.neutral.bg }}
      >
        <div className="mx-auto max-w-3xl rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Product unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error || "We couldn't find this product in the current inventory."}
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24 pt-20 md:pb-8"
      style={{ background: COLORS.neutral.bg }}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm shadow-slate-900/5 transition hover:text-slate-950"
        >
          <FiArrowLeft />
          Back
        </button>

        {feedback && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {feedback}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.75fr)]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50 sm:aspect-[16/10]">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 sm:p-6"
                />
              ) : (
                <FiSmartphone className="text-8xl text-blue-700/70" />
              )}

              <span
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ring-1 ${getBadgeTone(product)}`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto border-t border-slate-100 p-4">
                {galleryImages.slice(0, 6).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-slate-50 transition ${
                      activeImageIndex === index
                        ? "border-blue-500 ring-4 ring-blue-100"
                        : "border-slate-200 hover:border-blue-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6 xl:sticky xl:top-24 xl:self-start"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {product.brand}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {product.condition}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                PTA {product.ptaStatus === "yes" ? "Approved" : "No"}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-base font-medium text-slate-500">
              {product.brand} {product.model}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                <FiStar />
                {getReviewLabel(product)}
              </span>
              {product.batteryHealth !== null && product.batteryHealth !== undefined && (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                  <FiBatteryCharging />
                  {product.batteryHealth}% battery
                </span>
              )}
            </div>

            <div className="mt-6 rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                Price
              </p>
              <p className="mt-2 text-4xl font-black">{formatPKR(product.price)}</p>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {product.description || "No description has been added for this product yet."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-[auto_1fr]">
              <div className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-2">
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-bold text-slate-950">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(product.stock || 1, current + 1),
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={product.stock === 0}
                onClick={() => {
                  const result = addToCart(product, quantity);
                  setFeedback(result.message);
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold transition ${
                  product.stock === 0
                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                    : "bg-blue-700 text-white shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 hover:bg-blue-800"
                }`}
              >
                <FiShoppingCart />
                {product.stock === 0 ? "Unavailable" : "Add to Cart"}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {detailRows.slice(0, 4).map((row) => (
                <div key={row.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    {row.label}
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-slate-900">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </section>

        <section className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <FiInfo />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Full specs
                </h2>
                <p className="text-sm text-slate-500">Inventory-backed details.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {detailRows.map((row) => (
                <div key={row.label} className={specCardClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    {row.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-950">{row.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
              <FiCheckCircle className="mt-0.5 shrink-0" />
              Stock and availability are synced with live inventory.
            </div>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <FiStar />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Customer reviews
                </h2>
                <p className="text-sm text-slate-500">
                  Verified-buyer reviews only.
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
              <FiStar />
              {getReviewLabel(product)}
            </span>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[380px_1fr]">
            <div>
              {reviewPermissions.canReview ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4 rounded-2xl bg-slate-50 p-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                      Rating
                    </span>
                    <select
                      value={reviewForm.rating}
                      onChange={(event) =>
                        setReviewForm((current) => ({
                          ...current,
                          rating: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} star{rating > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                      Comment
                    </span>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(event) =>
                        setReviewForm((current) => ({
                          ...current,
                          comment: event.target.value,
                        }))
                      }
                      rows={4}
                      required
                      placeholder="Share your experience with this product"
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                  {!isAuthenticated
                    ? "Sign in and purchase this product to review it."
                    : reviewPermissions.hasReviewed
                      ? "You have already reviewed this product."
                      : "You can review this product after buying it from this store."}
                </p>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {product.reviews?.length > 0 ? (
                product.reviews.map((review) => (
                  <article
                    key={review._id}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm shadow-slate-900/5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-bold text-slate-950">{review.name}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        <FiStar />
                        {review.rating} / 5
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {review.comment}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 md:col-span-2">
                  No reviews yet.
                </p>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
