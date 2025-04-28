import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  proxy: {
    host: import.meta.env.VITE_API_HOSTNAME,
    port: 443,
  },
});

export default axiosInstance;
