import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiBox,
  FiEdit2,
  FiFilter,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSliders,
  FiTrash2,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminStatCard } from "../components/AdminStatCard";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { inventoryApi } from "../services/inventory";
import { formatPKR } from "../utils/currency";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const baseFilters = {
  brand: "all",
  category: "all",
  stockStatus: "all",
  status: "all",
  minPrice: "",
  maxPrice: "",
};

const createProductFormState = (product = null) => ({
  name: product?.name || "",
  brand: product?.brand || "",
  model: product?.model || "",
  price: product?.price ?? "",
  stock: product?.stock ?? 0,
  category: product?.category || "",
  condition: product?.condition || "new",
  batteryHealth:
    product?.batteryHealth === null || product?.batteryHealth === undefined
      ? ""
      : product.batteryHealth,
  description: product?.description || "",
  ptaStatus: product?.ptaStatus || "no",
  images: Array.isArray(product?.images) ? product.images : [],
  status: product?.status || "active",
  lowStockThreshold: product?.lowStockThreshold ?? 5,
});

const createBulkFormState = () => ({
  format: "json",
  payload: "",
});

const createStockFormState = (product = null) => ({
  action: "inward",
  quantity: 1,
  targetStock: product?.stock ?? 0,
  reason: "",
});

const parseNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const serializeProductForm = (formState) => ({
  name: formState.name.trim(),
  brand: formState.brand.trim(),
  model: formState.model.trim(),
  price: parseNumber(formState.price, 0),
  stock: parseNumber(formState.stock, 0),
  category: formState.category.trim(),
  condition: formState.condition,
  batteryHealth:
    formState.condition === "used" || formState.condition === "refurbished"
      ? formState.batteryHealth === ""
        ? null
        : parseNumber(formState.batteryHealth, 0)
      : null,
  description: formState.description.trim(),
  ptaStatus: formState.ptaStatus === "yes" ? "yes" : "no",
  images: Array.isArray(formState.images) ? formState.images.filter(Boolean) : [],
  status: formState.status,
  lowStockThreshold: parseNumber(formState.lowStockThreshold, 5),
});

const getOptimisticStock = (product, formState) => {
  if (!product) {
    return product;
  }

  if (formState.action === "set") {
    return {
      ...product,
      stock: Math.max(0, parseNumber(formState.targetStock, product.stock)),
    };
  }

  if (formState.action === "inward") {
    return {
      ...product,
      stock: product.stock + Math.max(0, parseNumber(formState.quantity, 0)),
    };
  }

  return {
    ...product,
    stock: Math.max(0, product.stock - Math.max(0, parseNumber(formState.quantity, 0))),
  };
};

const stockTone = (product) => {
  if (product.stock === 0) {
    return "bg-red-50 text-red-700";
  }

  if (product.stock <= product.lowStockThreshold) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-emerald-50 text-emerald-700";
};

const ptaTone = (ptaStatus) =>
  ptaStatus === "yes"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-700";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });

const ModalShell = ({ children, onClose, title, subtitle }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
          <FiX />
        </button>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  </div>
);

const ProductModal = ({
  formState,
  onChange,
  onClose,
  onSubmit,
  saving,
  isEditing,
}) => (
  <ModalShell
    onClose={onClose}
    title={isEditing ? "Edit product" : "Add product"}
    subtitle="Create or update a product record with stock, condition, pricing, and media."
  >
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">Name</span>
          <input
            required
            value={formState.name}
            onChange={(event) => onChange("name", event.target.value)}
            className="admin-input"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">Brand</span>
          <input
            required
            value={formState.brand}
            onChange={(event) => onChange("brand", event.target.value)}
            className="admin-input"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">Model</span>
          <input
            required
            value={formState.model}
            onChange={(event) => onChange("model", event.target.value)}
            className="admin-input"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">Category</span>
          <input
            required
            value={formState.category}
            onChange={(event) => onChange("category", event.target.value)}
            className="admin-input"
            placeholder="mobile, accessories, tablet..."
          />
        </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Price (PKR)</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={formState.price}
            onChange={(event) => onChange("price", event.target.value)}
            className="admin-input"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">
            Initial stock
          </span>
          <input
            required
            type="number"
            min="0"
            step="1"
            value={formState.stock}
            onChange={(event) => onChange("stock", event.target.value)}
            className="admin-input"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">
            Condition
          </span>
          <select
            value={formState.condition}
            onChange={(event) => onChange("condition", event.target.value)}
            className="admin-select w-full"
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">Status</span>
          <select
            value={formState.status}
            onChange={(event) => onChange("status", event.target.value)}
            className="admin-select w-full"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">
            PTA approved
          </span>
          <select
            value={formState.ptaStatus}
            onChange={(event) => onChange("ptaStatus", event.target.value)}
            className="admin-select w-full"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">
            Low stock threshold
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={formState.lowStockThreshold}
            onChange={(event) => onChange("lowStockThreshold", event.target.value)}
            className="admin-input"
          />
        </label>
        {(formState.condition === "used" ||
          formState.condition === "refurbished") && (
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-600">
                Battery health
              </span>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={formState.batteryHealth}
                onChange={(event) => onChange("batteryHealth", event.target.value)}
                className="admin-input"
                placeholder="Required for used devices"
              />
            </label>
          )}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-600">
          Description
        </span>
        <textarea
          rows="4"
          value={formState.description}
          onChange={(event) => onChange("description", event.target.value)}
          className="admin-input min-h-[120px]"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-600">
          Product images
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="admin-input"
          onChange={async (event) => {
            const files = Array.from(event.target.files || []);

            if (files.length === 0) {
              return;
            }

            const imageDataUrls = await Promise.all(files.map(readFileAsDataUrl));
            onChange("images", imageDataUrls.filter(Boolean));
            event.target.value = "";
          }}
        />
        <p className="mt-2 text-xs text-slate-500">
          Upload one or more images. Selecting new files replaces the current set.
        </p>

        {formState.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {formState.images.map((image, index) => (
              <div
                key={`${image.slice(0, 32)}-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={image}
                  alt={`Product preview ${index + 1}`}
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </label>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onClose} className="admin-button-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="admin-button-primary">
          {saving ? "Saving..." : isEditing ? "Update product" : "Create product"}
        </button>
      </div>
    </form>
  </ModalShell>
);

const StockModal = ({ product, formState, onChange, onClose, onSubmit, saving }) => (
  <ModalShell
    onClose={onClose}
    title="Adjust stock"
    subtitle={`Manage stock movement and log the reason for ${product?.name || "this product"}.`}
  >
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="rounded-[28px] bg-slate-950 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
          Current stock
        </p>
        <p className="mt-3 text-4xl font-black">{product?.stock ?? 0}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">Action</span>
          <select
            value={formState.action}
            onChange={(event) => onChange("action", event.target.value)}
            className="admin-select w-full"
          >
            <option value="inward">Stock inward</option>
            <option value="outward">Stock outward</option>
            <option value="set">Set exact stock</option>
          </select>
        </label>

        {formState.action === "set" ? (
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">
              Target stock
            </span>
            <input
              type="number"
              min="0"
              step="1"
              value={formState.targetStock}
              onChange={(event) => onChange("targetStock", event.target.value)}
              className="admin-input"
            />
          </label>
        ) : (
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">
              Quantity
            </span>
            <input
              type="number"
              min="1"
              step="1"
              value={formState.quantity}
              onChange={(event) => onChange("quantity", event.target.value)}
              className="admin-input"
            />
          </label>
        )}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-600">Reason</span>
        <textarea
          rows="3"
          value={formState.reason}
          onChange={(event) => onChange("reason", event.target.value)}
          className="admin-input min-h-[110px]"
          placeholder="Restock, manual correction, order issue..."
        />
      </label>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onClose} className="admin-button-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="admin-button-primary">
          {saving ? "Updating..." : "Update stock"}
        </button>
      </div>
    </form>
  </ModalShell>
);

const BulkUploadModal = ({ formState, onChange, onClose, onSubmit, saving }) => (
  <ModalShell
    onClose={onClose}
    title="Bulk upload"
    subtitle="Upload products as JSON or CSV. The backend will validate and create stock logs for each item."
  >
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">Format</span>
          <select
            value={formState.format}
            onChange={(event) => onChange("format", event.target.value)}
            className="admin-select w-full"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">Import file</span>
          <input
            type="file"
            accept={formState.format === "json" ? ".json" : ".csv,text/csv"}
            className="admin-input"
            onChange={async (event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              const fileText = await file.text();
              onChange("payload", fileText);
            }}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-600">
          Paste payload
        </span>
        <textarea
          rows="12"
          value={formState.payload}
          onChange={(event) => onChange("payload", event.target.value)}
          className="admin-input min-h-[260px] font-mono text-xs"
          placeholder={
            formState.format === "json"
              ? '[{"name":"iPhone 13","brand":"Apple","model":"A2633","price":500,"stock":5,"category":"mobile","condition":"used"}]'
              : "name,brand,model,price,stock,category,condition\nGalaxy S24,Samsung,S24,999,8,mobile,new"
          }
        />
      </label>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onClose} className="admin-button-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="admin-button-primary">
          {saving ? "Uploading..." : "Upload products"}
        </button>
      </div>
    </form>
  </ModalShell>
);

export const InventoryPage = () => {
  const [inventory, setInventory] = useState({
    products: [],
    filters: {
      brands: [],
      categories: [],
    },
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
  const [summary, setSummary] = useState({
    stats: {
      totalProducts: 0,
      totalUnits: 0,
      stockValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
    },
    lowStockProducts: [],
    recentLogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(baseFilters);
  const [page, setPage] = useState(1);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [stockProduct, setStockProduct] = useState(null);
  const [productForm, setProductForm] = useState(createProductFormState());
  const [bulkForm, setBulkForm] = useState(createBulkFormState());
  const [stockForm, setStockForm] = useState(createStockFormState());
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingBulkUpload, setSavingBulkUpload] = useState(false);
  const [savingStock, setSavingStock] = useState(false);
  const debouncedSearch = useDebouncedValue(searchQuery, 450);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.brand,
    filters.category,
    filters.maxPrice,
    filters.minPrice,
    filters.status,
    filters.stockStatus,
  ]);

  const loadInventory = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const [productData, summaryData] = await Promise.all([
        inventoryApi.getProducts({
          search: debouncedSearch,
          page,
          limit: 10,
          status: filters.status,
          brand: filters.brand,
          category: filters.category,
          stockStatus: filters.stockStatus,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sortBy: "updatedAt",
          sortOrder: "desc",
        }),
        inventoryApi.getInventorySummary(),
      ]);

      setInventory(productData);
      setSummary(summaryData);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Failed to load inventory",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [
    debouncedSearch,
    filters.brand,
    filters.category,
    filters.maxPrice,
    filters.minPrice,
    filters.status,
    filters.stockStatus,
    page,
  ]);

  const stats = useMemo(
    () => [
      {
        label: "Products",
        value: summary.stats.totalProducts,
        icon: FiPackage,
        accent: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        hint: "Catalog records across active and inactive inventory",
      },
      {
        label: "Units on hand",
        value: summary.stats.totalUnits,
        icon: FiBox,
        accent: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
        hint: "Total stock currently available in the warehouse",
      },
      {
        label: "Low stock alerts",
        value: summary.stats.lowStockCount,
        icon: FiAlertCircle,
        accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        hint: "Products at or below their low-stock threshold",
      },
      {
        label: "Out of stock",
        value: summary.stats.outOfStockCount,
        icon: FiAlertCircle,
        accent: "linear-gradient(135deg, #fb7185 0%, #dc2626 100%)",
        hint: "Items that cannot be sold right now",
      },
    ],
    [summary.stats],
  );

  const updateProductListItem = (productId, updater) => {
    setInventory((current) => ({
      ...current,
      products: current.products.map((product) =>
        product._id === productId ? updater(product) : product,
      ),
    }));
  };

  const handleProductFieldChange = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const handleBulkFieldChange = (field, value) => {
    setBulkForm((current) => ({ ...current, [field]: value }));
  };

  const handleStockFieldChange = (field, value) => {
    setStockForm((current) => ({ ...current, [field]: value }));
  };

  const openCreateModal = () => {
    setActiveProduct(null);
    setProductForm(createProductFormState());
    setProductModalOpen(true);
  };

  const openEditModal = (product) => {
    setActiveProduct(product);
    setProductForm(createProductFormState(product));
    setProductModalOpen(true);
  };

  const openStockModal = (product) => {
    setStockProduct(product);
    setStockForm(createStockFormState(product));
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setSavingProduct(true);

    const payload = serializeProductForm(productForm);

    try {
      if (activeProduct) {
        const previousProduct = inventory.products.find(
          (product) => product._id === activeProduct._id,
        );

        updateProductListItem(activeProduct._id, (product) => ({
          ...product,
          ...payload,
          images: payload.images,
        }));

        const response = await inventoryApi.updateProduct(activeProduct._id, payload);
        updateProductListItem(activeProduct._id, () => response.product);
        setFeedback("Product updated successfully");

        if (!previousProduct) {
          await loadInventory(true);
        }
      } else {
        const response = await inventoryApi.createProduct(payload);
        setInventory((current) => ({
          ...current,
          products:
            current.pagination.page === 1
              ? [response.product, ...current.products].slice(0, 10)
              : current.products,
          pagination: {
            ...current.pagination,
            total: current.pagination.total + 1,
          },
        }));
        setFeedback("Product created successfully");
      }

      setProductModalOpen(false);
      await loadInventory(true);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Failed to save product",
      );
      await loadInventory(true);
    } finally {
      setSavingProduct(false);
    }
  };

  const submitBulkUpload = async (event) => {
    event.preventDefault();
    setSavingBulkUpload(true);

    try {
      const response = await inventoryApi.bulkUploadProducts({
        format: bulkForm.format,
        payload: bulkForm.payload,
      });

      setFeedback(response.message || "Bulk upload completed");
      setBulkForm(createBulkFormState());
      setBulkModalOpen(false);
      setPage(1);
      await loadInventory(true);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Bulk upload failed",
      );
    } finally {
      setSavingBulkUpload(false);
    }
  };

  const submitStockAdjustment = async (event) => {
    event.preventDefault();

    if (!stockProduct) {
      return;
    }

    setSavingStock(true);
    const previousProduct = inventory.products.find(
      (product) => product._id === stockProduct._id,
    );

    updateProductListItem(stockProduct._id, (product) =>
      getOptimisticStock(product, stockForm),
    );

    try {
      const response = await inventoryApi.updateStock(stockProduct._id, {
        action: stockForm.action,
        quantity: parseNumber(stockForm.quantity, 1),
        targetStock: parseNumber(stockForm.targetStock, stockProduct.stock),
        reason: stockForm.reason,
      });

      updateProductListItem(stockProduct._id, () => response.product);
      setFeedback("Stock updated successfully");
      setStockProduct(null);
      await loadInventory(true);
    } catch (requestError) {
      if (previousProduct) {
        updateProductListItem(stockProduct._id, () => previousProduct);
      }

      setError(
        requestError?.response?.data?.message || "Failed to update stock",
      );
    } finally {
      setSavingStock(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const previousProducts = inventory.products;

    setInventory((current) => ({
      ...current,
      products: current.products.filter((item) => item._id !== product._id),
      pagination: {
        ...current.pagination,
        total: Math.max(0, current.pagination.total - 1),
      },
    }));

    try {
      await inventoryApi.deleteProduct(product._id);
      setFeedback(`${product.name} deleted successfully`);
      await loadInventory(true);
    } catch (requestError) {
      setInventory((current) => ({
        ...current,
        products: previousProducts,
        pagination: {
          ...current.pagination,
          total: current.pagination.total + 1,
        },
      }));
      setError(
        requestError?.response?.data?.message || "Failed to delete product",
      );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-panel flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading inventory...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminPageHeader
          eyebrow="Inventory"
          title="Run stock like an operating system"
          description="Manage live products, adjust stock with logs, bulk upload records, and keep low-stock alerts visible without leaving the inventory workspace."
          meta={[
            `${summary.stats.totalProducts} products`,
            `${summary.stats.lowStockCount} low-stock alerts`,
            `${formatPKR(summary.stats.stockValue || 0)} stock value`,
          ]}
          actions={
            <>
              <button
                onClick={() => setBulkModalOpen(true)}
                className="admin-button-secondary w-full sm:w-auto"
              >
                <FiUploadCloud />
                Bulk upload
              </button>
              <button
                onClick={openCreateModal}
                className="admin-button-primary w-full sm:w-auto"
              >
                <FiPlus />
                Add product
              </button>
              <button
                onClick={() => loadInventory(true)}
                className="admin-button-secondary w-full sm:w-auto"
              >
                <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </>
          }
        />

        {feedback && (
          <div className="admin-panel border-emerald-200/80 bg-emerald-50/90 p-4 text-sm font-semibold text-emerald-700">
            {feedback}
          </div>
        )}

        {error && (
          <div className="admin-panel border-red-200/80 bg-red-50/90 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <motion.div key={stat.label} {...sectionMotion}>
              <AdminStatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 2xl:grid-cols-[1.5fr_1fr]">
          <motion.section {...sectionMotion} className="admin-section space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <FiSearch
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by product, brand, model, or category"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="admin-input pl-11"
                />
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-none lg:auto-cols-fr lg:grid-flow-col lg:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
                  <FiFilter size={18} />
                </div>
                <select
                  value={filters.brand}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, brand: event.target.value }))
                  }
                  className="admin-select w-full min-w-0 lg:min-w-[170px]"
                >
                  <option value="all">All brands</option>
                  {inventory.filters.brands?.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.category}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="admin-select w-full min-w-0 lg:min-w-[170px]"
                >
                  <option value="all">All categories</option>
                  {inventory.filters.categories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-5">
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  Stock
                </span>
                <select
                  value={filters.stockStatus}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      stockStatus: event.target.value,
                    }))
                  }
                  className="admin-select w-full"
                >
                  <option value="all">All stock</option>
                  <option value="in">In stock</option>
                  <option value="low">Low stock</option>
                  <option value="out">Out of stock</option>
                </select>
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  Status
                </span>
                <select
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, status: event.target.value }))
                  }
                  className="admin-select w-full"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-600">
                   Min price (PKR)
                  </span>
                <input
                  type="number"
                  min="0"
                  value={filters.minPrice}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, minPrice: event.target.value }))
                  }
                  className="admin-input"
                />
              </label>
              <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-600">
                   Max price (PKR)
                  </span>
                <input
                  type="number"
                  min="0"
                  value={filters.maxPrice}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, maxPrice: event.target.value }))
                  }
                  className="admin-input"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setFilters(baseFilters);
                  setSearchQuery("");
                }}
                className="admin-button-secondary w-full sm:col-span-2 2xl:col-span-1 2xl:mt-auto"
              >
                <FiSliders />
                Reset filters
              </button>
            </div>

            {inventory.products.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto 2xl:block">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        <th className="px-4 py-4">Product</th>
                        <th className="px-4 py-4">Category</th>
                        <th className="px-4 py-4">Condition</th>
                        <th className="px-4 py-4">PTA</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4 text-center">Stock</th>
                          <th className="px-4 py-4 text-right">Price (PKR)</th>
                        <th className="px-4 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.products.map((product) => (
                        <tr
                          key={product._id}
                          className="border-b border-slate-200/80 transition hover:bg-blue-50/40"
                        >
                          <td className="px-4 py-5">
                            <p className="font-bold text-slate-950">{product.name}</p>
                            <p className="mt-1 text-sm text-slate-600">
                              {product.brand} {product.model}
                            </p>
                          </td>
                          <td className="px-4 py-5">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-5 capitalize text-sm font-semibold text-slate-600">
                            {product.condition}
                          </td>
                          <td className="px-4 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-sm font-semibold ${ptaTone(product.ptaStatus)}`}
                            >
                              {product.ptaStatus === "yes" ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-4 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-sm font-semibold ${product.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                                }`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-center">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${stockTone(product)}`}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-right text-lg font-black text-slate-950">
                            {formatPKR(product.price)}
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openStockModal(product)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                                title="Adjust stock"
                              >
                                <FiPackage size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(product)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                                title="Edit product"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                                title="Delete product"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 2xl:hidden">
                  {inventory.products.map((product) => (
                    <article
                      key={product._id}
                      className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="break-words text-lg font-bold text-slate-950">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {product.brand} {product.model}
                          </p>
                        </div>
                        <p className="shrink-0 text-2xl font-black text-slate-950">
                          {formatPKR(product.price)}
                        </p>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Category
                          </p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {product.category}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Condition
                          </p>
                          <p className="mt-2 text-sm font-semibold capitalize text-slate-900">
                            {product.condition}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            PTA
                          </p>
                          <span
                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${ptaTone(product.ptaStatus)}`}
                          >
                            {product.ptaStatus === "yes" ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Status
                          </p>
                          <span
                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              product.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 sm:col-span-2">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Stock
                              </p>
                              <span
                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${stockTone(product)}`}
                              >
                                {product.stock} units
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-end">
                              <button
                                type="button"
                                onClick={() => openStockModal(product)}
                                className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700 transition hover:bg-amber-100 sm:w-10"
                                title="Adjust stock"
                              >
                                <FiPackage size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(product)}
                                className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100 sm:w-10"
                                title="Edit product"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product)}
                                className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 sm:w-10"
                                title="Delete product"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="flex flex-col gap-4 rounded-[28px] bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-600">
                    Page {inventory.pagination.page} of {inventory.pagination.totalPages}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:flex">
                    <button
                      type="button"
                      disabled={!inventory.pagination.hasPreviousPage}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="admin-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={!inventory.pagination.hasNextPage}
                      onClick={() => setPage((current) => current + 1)}
                      className="admin-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/90 px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-lg shadow-slate-900/5">
                  <FiPackage size={28} />
                </div>
                <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
                  No inventory to display
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Adjust the current filters or add a new product to populate the table.
                </p>
              </div>
            )}
          </motion.section>

          <motion.aside {...sectionMotion} className="space-y-8">
            <section className="admin-section">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <FiAlertCircle size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Low stock alerts
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    The most urgent products that need replenishment soon.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {summary.lowStockProducts?.length > 0 ? (
                  summary.lowStockProducts.map((product) => (
                    <div
                      key={product._id}
                      className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4"
                    >
                      <p className="font-bold text-slate-950">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {product.brand} {product.model}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-amber-800">
                        {product.stock} left, threshold {product.lowStockThreshold}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="admin-soft-panel p-5 text-sm text-slate-600">
                    No low-stock alerts right now.
                  </div>
                )}
              </div>
            </section>

            <section className="admin-section">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <FiRefreshCw size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Recent stock logs
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Latest inward, outward, and adjustment activity.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {summary.recentLogs?.length > 0 ? (
                  summary.recentLogs.map((log) => (
                    <div
                      key={log._id}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-950">
                            {log.product?.name || "Deleted product"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600 capitalize">
                            {log.type} {log.quantity} units
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                          {log.referenceType}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">
                        {log.reason || "No reason provided"}
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="admin-soft-panel p-5 text-sm text-slate-600">
                    No stock movements have been logged yet.
                  </div>
                )}
              </div>
            </section>
          </motion.aside>
        </div>
      </div>

      {productModalOpen && (
        <ProductModal
          formState={productForm}
          onChange={handleProductFieldChange}
          onClose={() => setProductModalOpen(false)}
          onSubmit={submitProduct}
          saving={savingProduct}
          isEditing={Boolean(activeProduct)}
        />
      )}

      {bulkModalOpen && (
        <BulkUploadModal
          formState={bulkForm}
          onChange={handleBulkFieldChange}
          onClose={() => setBulkModalOpen(false)}
          onSubmit={submitBulkUpload}
          saving={savingBulkUpload}
        />
      )}

      {stockProduct && (
        <StockModal
          product={stockProduct}
          formState={stockForm}
          onChange={handleStockFieldChange}
          onClose={() => setStockProduct(null)}
          onSubmit={submitStockAdjustment}
          saving={savingStock}
        />
      )}
    </AdminLayout>
  );
};
