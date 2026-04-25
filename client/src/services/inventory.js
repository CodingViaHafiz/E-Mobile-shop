import axiosInstance from "./api";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "all"
    ) {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

const get = async (path, params) => {
  const queryString = buildQueryString(params);
  const { data } = await axiosInstance.get(
    queryString ? `${path}?${queryString}` : path,
  );

  return data;
};

export const inventoryApi = {
  getProducts: (params) => get("/products", params),
  getProductById: async (id) => {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data;
  },
  createProduct: async (payload) => {
    const { data } = await axiosInstance.post("/products", payload);
    return data;
  },
  updateProduct: async (id, payload) => {
    const { data } = await axiosInstance.put(`/products/${id}`, payload);
    return data;
  },
  deleteProduct: async (id) => {
    const { data } = await axiosInstance.delete(`/products/${id}`);
    return data;
  },
  bulkUploadProducts: async (payload) => {
    const { data } = await axiosInstance.post("/products/bulk", payload);
    return data;
  },
  updateStock: async (id, payload) => {
    const { data } = await axiosInstance.patch(`/products/stock/${id}`, payload);
    return data;
  },
  getInventorySummary: () => get("/products/admin/summary"),
  getInventoryLogs: (params) => get("/products/admin/logs", params),
  getInventoryAnalytics: () => get("/products/admin/analytics"),
};
