import axios from 'axios';
import Auth from "../schema/Auth";

const config = {
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  headers: {},
};

const storedAuth = localStorage.getItem('auth');

if (storedAuth) {
  const auth: Auth = JSON.parse(storedAuth);
  config.headers['Authorization'] = `Bearer ${auth.token}`;
}

const apiClient = axios.create(config);

export default apiClient;