import axiosInstance from "./api";

export const authRequestApi = {
  createPasswordResetRequest: async (payload) => {
    const { data } = await axiosInstance.post("/auth/password-reset-requests", payload);
    return data;
  },
  getPasswordResetRequests: async (status = "all") => {
    const query = status && status !== "all" ? `?status=${status}` : "";
    const { data } = await axiosInstance.get(
      `/auth/admin/password-reset-requests${query}`,
    );
    return data;
  },
  updatePasswordResetRequest: async (id, payload) => {
    const { data } = await axiosInstance.patch(
      `/auth/admin/password-reset-requests/${id}`,
      payload,
    );
    return data;
  },
};
