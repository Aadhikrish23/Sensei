import axios from "axios";
import tokenServices from "../utils/tokenServices";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 60000
});

console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

const showError = (error: any) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0] ||
    error?.message ||
    "Something went wrong";

  toast.error(message);
};

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      console.log("401 detected");

      if (originalRequest?._refresh) {
        showError(error);
        return Promise.reject(error);
      }

      if (originalRequest?.url?.includes("/auth/refresh")) {
        showError(error);
        return Promise.reject(error);
      }

      originalRequest._refresh = true;

      try {
        const userdata = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

      const token = userdata.data.Data.accessToken;

        tokenServices.setToken(token);

        originalRequest.headers = originalRequest.headers || {};

        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return apiClient(originalRequest);

      } catch (refreshError) {

        tokenServices.clearToken();
        tokenServices.triggerLogout();

        showError(refreshError);

        return Promise.reject(refreshError);
      }
    }

    showError(error);

    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenServices.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    showError(error);
    return Promise.reject(error);
  }
);

export default apiClient;