import axiosInstance from "./api";

export const orderApi = {
  placeOrder: async (payload) => {
    const { data } = await axiosInstance.post("/orders", payload);
    return data;
  },
  getMyOrders: async () => {
    const { data } = await axiosInstance.get("/orders/mine");
    return data;
  },
  getAdminOrders: async (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === "all") {
        return;
      }

      searchParams.set(key, String(value));
    });

    const { data } = await axiosInstance.get(
      searchParams.toString() ? `/orders/admin?${searchParams.toString()}` : "/orders/admin",
    );
    return data;
  },
  updateAdminOrder: async (id, payload) => {
    const { data } = await axiosInstance.patch(`/orders/${id}`, payload);
    return data;
  },
};
