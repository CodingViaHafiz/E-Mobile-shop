import axiosInstance from "./api";

export const orderApi = {
  placeOrder: async (payload) => {
    const { data } = await axiosInstance.post("/orders", payload);
    return data;
  },
};
