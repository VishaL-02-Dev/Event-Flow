import axios from "axios";

const ADMIN_API = axios.create({
  baseURL: "https://event-flow-5q4k.onrender.com/api/admin",
});

ADMIN_API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default ADMIN_API;