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
  timeout: 60000,
});

// -----------------------------
// 🔥 Error helper
// -----------------------------
const showError = (error: any) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0] ||
    error?.message ||
    "Something went wrong";

  toast.error(message);
};

// -----------------------------
// 🔥 Refresh control (IMPORTANT)
// -----------------------------
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// -----------------------------
// 🔥 Response Interceptor
// -----------------------------
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🚨 Only handle 401 (not login/refresh)
    if (
      error.response?.status === 401 &&
      !originalRequest?.url?.includes("/auth/login") &&
      !originalRequest?.url?.includes("/auth/refresh")
    ) {
      // Prevent infinite loop
      if (originalRequest?._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // 🔒 If already refreshing → wait
        if (isRefreshing && refreshPromise) {
          await refreshPromise;
        } else {
          // 🔥 Start refresh
          isRefreshing = true;

          refreshPromise = axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const res = await refreshPromise;

          const newToken = res.data.Data.accessToken;

          // Save token
          tokenServices.setToken(newToken);

          // Set default header
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
        }

        // Attach new token to original request
        const token = tokenServices.getToken();
        if (token) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // ❌ Refresh failed → logout
        tokenServices.clearToken();
        tokenServices.triggerLogout();

        showError(refreshError);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Normal errors
    showError(error);
    return Promise.reject(error);
  }
);

// -----------------------------
// 🔥 Request Interceptor
// -----------------------------
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