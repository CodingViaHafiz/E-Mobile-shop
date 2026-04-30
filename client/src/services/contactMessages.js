import axiosInstance from "./api";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

export const contactMessageApi = {
  createMessage: async (payload) => {
    const { data } = await axiosInstance.post("/contact-messages", payload);
    return data;
  },
  getAdminMessages: async (params = {}) => {
    const queryString = buildQueryString(params);
    const { data } = await axiosInstance.get(
      queryString ? `/contact-messages/admin?${queryString}` : "/contact-messages/admin",
    );
    return data;
  },
  updateMessage: async (id, payload) => {
    const { data } = await axiosInstance.patch(`/contact-messages/${id}`, payload);
    return data;
  },
  deleteMessage: async (id) => {
    const { data } = await axiosInstance.delete(`/contact-messages/${id}`);
    return data;
  },
};
