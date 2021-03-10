import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.request.use((config) => {
  console.log(process.env.API_URL);
  config.baseURL = process.env.API_URL || "http://localhost:5000";
  return config;
});

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("An unexpected error occured");
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
