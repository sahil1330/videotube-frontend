import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://videotube-gm5j2.ondigitalocean.app/api/v1",
  withCredentials: true,
  proxy: {
    host: import.meta.env.VITE_API_HOSTNAME,
    port: 443,
  },
});

export default axiosInstance;
