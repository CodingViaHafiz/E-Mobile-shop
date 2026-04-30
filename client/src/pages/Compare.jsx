import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBarChart2, FiSearch, FiSmartphone } from "react-icons/fi";
import { inventoryApi } from "../services/inventory";
import { formatPKR } from "../utils/currency";

const getCompareLabel = (product) =>
  product ? `${product.name} | ${product.brand} ${product.model}` : "";

export const Compare = () => {
  const [compareOptions, setCompareOptions] = useState([]);
  const [compareFirstQuery, setCompareFirstQuery] = useState("");
  const [compareSecondQuery, setCompareSecondQuery] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchCompareOptions = async () => {
      try {
        const data = await inventoryApi.getProducts({ page: 1, limit: 200, sortBy: "name", sortOrder: "asc" });
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
    () => compareOptions.find((p) => getCompareLabel(p) === compareFirstQuery),
    [compareFirstQuery, compareOptions],
  );

  const secondCompareOptions = useMemo(() => {
    if (!firstCompareProduct) return compareOptions;
    return compareOptions.filter((p) => p._id !== firstCompareProduct._id && p.category === firstCompareProduct.category);
  }, [compareOptions, firstCompareProduct]);

  const secondCompareProduct = useMemo(
    () => secondCompareOptions.find((p) => getCompareLabel(p) === compareSecondQuery),
    [compareSecondQuery, secondCompareOptions],
  );

  const comparisonRows = [
    { label: "Brand", getValue: (p) => p?.brand || "-" },
    { label: "Model", getValue: (p) => p?.model || "-" },
    { label: "Category", getValue: (p) => p?.category || "-" },
    { label: "Condition", getValue: (p) => p?.condition || "-" },
    { label: "Price", getValue: (p) => (p ? formatPKR(p.price) : "-") },
    { label: "Stock", getValue: (p) => (p ? `${p.stock} units` : "-") },
    { label: "PTA", getValue: (p) => (p ? (p.ptaStatus === "yes" ? "Approved" : "No") : "-") },
    { label: "Battery", getValue: (p) => (p?.batteryHealth !== undefined ? `${p.batteryHealth}%` : "N/A") },
    { label: "Rating", getValue: (p) => (p?.reviewCount ? `${p.averageRating} / 5 (${p.reviewCount})` : "No reviews") },
  ];

  const renderCompareProduct = (product, fallback) => (
    <div className="min-w-0 rounded-2xl border border-neutral-100 bg-white p-3 text-slate-900">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-slate-50">
        {product?.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain p-2" />
        ) : (
          <FiSmartphone className="text-5xl text-slate-400" />
        )}
      </div>
      <p className="mt-3 truncate text-sm font-black text-slate-900">{product?.name || fallback}</p>
      <p className="mt-1 truncate text-xs text-slate-600">{product ? `${product.brand} ${product.model}` : "Select a product"}</p>
      <p className="mt-2 text-base font-black text-slate-900">{product ? formatPKR(product.price) : "-"}</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 pt-20" style={{ background: "var(--bg, #f8fafc)" }}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <motion.section initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[24px] border border-neutral-100 bg-white p-6 shadow-md">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                <FiBarChart2 />
                Compare
              </p>
              <h1 className="mt-4 text-2xl font-black text-slate-900">Compare two devices</h1>
              <p className="mt-2 text-sm text-slate-600">Type a product name or brand to search and compare two devices side-by-side.</p>
            </div>

            <div className="grid gap-3">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-600">First device</span>
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    list="compare-first-products"
                    value={compareFirstQuery}
                    onChange={(e) => setCompareFirstQuery(e.target.value)}
                    placeholder="Search product name, brand, or model"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <datalist id="compare-first-products">
                  {compareOptions.map((product) => (
                    <option key={product._id} value={getCompareLabel(product)} />
                  ))}
                </datalist>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-600">Second device</span>
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    list="compare-second-products"
                    value={compareSecondQuery}
                    onChange={(e) => setCompareSecondQuery(e.target.value)}
                    placeholder={firstCompareProduct ? `Search another ${firstCompareProduct.category}` : "Select first product first"}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <datalist id="compare-second-products">
                  {secondCompareOptions.map((product) => (
                    <option key={product._id} value={getCompareLabel(product)} />
                  ))}
                </datalist>
              </label>
            </div>
          </div>
        </motion.section>

        <div className="mt-6 rounded-[20px] bg-white p-4 shadow-sm border border-neutral-100">
          <div className="grid grid-cols-2 gap-4">
            {renderCompareProduct(firstCompareProduct, "First device")}
            {renderCompareProduct(secondCompareProduct, "Second device")}
          </div>

          {firstCompareProduct && secondCompareProduct ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-100">
              {comparisonRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)] gap-2 border-t px-3 py-3 text-sm first:border-t-0">
                  <span className="font-bold uppercase tracking-[0.08em] text-slate-600">{row.label}</span>
                  <span className="min-w-0 break-words font-semibold text-slate-900">{row.getValue(firstCompareProduct)}</span>
                  <span className="min-w-0 break-words font-semibold text-slate-900">{row.getValue(secondCompareProduct)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-neutral-200 px-4 py-8 text-center text-sm font-semibold text-slate-500">
              Select two devices to view the side-by-side comparison.
              <div className="mt-3">
                <Link to="/shop" className="text-blue-600 underline">Browse products</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;
