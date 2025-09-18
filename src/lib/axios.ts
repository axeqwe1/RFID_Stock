import axios, { type AxiosInstance } from "axios";

function createAxiosInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const isUnauthorized = error.response?.status === 401;
      const url = new URL(originalRequest.url, baseURL).pathname;
      const isRefreshCall = url === "/api/Auth/refresh";
      const isLoginCall = url === "/api/Auth/login";
      const hasAuthenCookie = document.cookie.includes("auth_status");

      if (isUnauthorized && isLoginCall) {
        return Promise.reject(error);
      }

      if (
        isUnauthorized &&
        !originalRequest._retry &&
        !isRefreshCall &&
        !isLoginCall &&
        hasAuthenCookie
      ) {
        originalRequest._retry = true;
        try {
          // call refresh (ใช้ instance เดิม)
          await instance.post("/api/Auth/refresh");
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          if (window.location.pathname !== "/login") {
            window.location.href = `${import.meta.env.BASE_URL.replace(
              /\/$/,
              ""
            )}/login`;
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

export default createAxiosInstance;
