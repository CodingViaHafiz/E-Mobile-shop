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
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";
import { inventoryApi } from "../services/inventory";
import { useCart } from "../store/CartContext";

const getBadgeTone = (product) => {
  if (!product || product.stock === 0) {
    return "bg-red-50 text-red-700";
  }

  if (product.stock <= product.lowStockThreshold) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-emerald-50 text-emerald-700";
};

export const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const { addToCart, syncProduct } = useCart();

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
      { label: "PTA tax", value: `$${product.ptaTax.toFixed(2)}` },
      ...(product.batteryHealth !== null && product.batteryHealth !== undefined
        ? [{ label: "Battery health", value: `${product.batteryHealth}%` }]
        : []),
    ];
  }, [product]);

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
        <div className="mx-auto max-w-3xl rounded-[32px] border border-red-100 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
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
      <div className="mx-auto max-w-7xl px-4 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <FiArrowLeft />
          Back
        </button>

        {feedback && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {feedback}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-[32px] border border-white/60 bg-white/85 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
          >
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-100 via-slate-50 to-amber-50">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiSmartphone className="text-8xl text-blue-700/70" />
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {product.brand}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {product.condition}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeTone(product)}`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
                {product.name}
              </h1>
              <p className="mt-2 text-lg text-slate-500">
                {product.brand} {product.model}
              </p>

              <div className="mt-6 rounded-[28px] bg-slate-950 p-5 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                      Price
                    </p>
                    <p className="mt-2 text-4xl font-black">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>PTA tax</p>
                    <p className="mt-1 font-semibold text-white">
                      ${product.ptaTax.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-600">
                {product.description || "No description has been added for this product yet."}
              </p>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-2">
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
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition ${
                    product.stock === 0
                      ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                      : "bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:-translate-y-0.5 hover:bg-slate-900"
                  }`}
                >
                  <FiShoppingCart />
                  {product.stock === 0 ? "Currently unavailable" : "Add to Cart"}
                </button>
              </div>

              {product.batteryHealth !== null && product.batteryHealth !== undefined && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  <FiBatteryCharging />
                  Battery health: {product.batteryHealth}%
                </div>
              )}
            </div>

            <div className="rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <FiInfo />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-950">
                    Product details
                  </h2>
                  <p className="text-sm text-slate-500">
                    Inventory-backed attributes from the database.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {detailRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {row.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                  <FiCheckCircle className="mt-0.5 shrink-0" />
                  Only active products are visible in the storefront, and the cart
                  button is automatically disabled when stock reaches zero.
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};
