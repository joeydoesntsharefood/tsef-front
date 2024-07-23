import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const app = axios.create({ baseURL });

app.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Substitua pelo método que você usa para obter o token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

app.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default app;