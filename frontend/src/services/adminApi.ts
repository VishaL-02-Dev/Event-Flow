import axios from "axios";

const ADMIN_API = axios.create({
  baseURL: "http://localhost:3000/api/admin",
});

ADMIN_API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default ADMIN_API;