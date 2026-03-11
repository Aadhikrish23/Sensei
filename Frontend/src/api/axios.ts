import axios from "axios";
import tokenServices from "../utils/tokenServices";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL+ "/api",

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
console.log("API URL:", import.meta.env.VITE_API_URL);
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log("401 detected");
      const originalRequest = error.config;
      if (originalRequest._refresh) {
        return Promise.reject(error);
      }
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }
      originalRequest._refresh = true;
      try {
        const userdata = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const token = userdata.data.token;
        tokenServices.setToken(token);
        originalRequest.headers = originalRequest.headers || {};
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      } catch (error) {
        tokenServices.clearToken();
        tokenServices.triggerLogout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenServices.getToken(); // here i dont know how to fetch the access token.

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
