export const API = import.meta.env.MODE === "production"
  ? "https://ninerhub-backend.onrender.com/api"
  : "http://localhost:5000/api";
  