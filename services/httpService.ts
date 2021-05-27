import axios from "axios";
import { toast } from "react-toastify";
import tokenService from "./tokenService";

axios.interceptors.request.use((config) => {
  config.baseURL = process.env.API_URL || "http://localhost:5000";
  config.withCredentials = true;
  return config;
});

axios.interceptors.response.use(null, async (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (expectedError) {
    try {
      await tokenService.refreshToken();
      await axios.request(error.config);
    } catch (error) {}
  }

  if (!expectedError) {
    toast.error("An unexpected error occured", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};
