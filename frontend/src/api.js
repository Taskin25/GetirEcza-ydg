// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// ✅ Token'ı HER REQUEST'te localStorage'dan oku
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // token yoksa header'ı temiz tut
    if (config.headers && config.headers.Authorization) {
      delete config.headers.Authorization;
    }
  }
  return config;
});

export default api;
