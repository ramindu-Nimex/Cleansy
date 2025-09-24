import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:3000/api",
  withCredentials: true, // include cookies like access_token
});

export const initCSRF = async () => {
  const res = await api.get("/csrf-token"); // fetch token from backend
  const csrfToken = res.data.csrfToken;

  // attach token to every request
  api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
};

export default api;
