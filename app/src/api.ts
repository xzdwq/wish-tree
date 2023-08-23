import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',
  withCredentials: true,
});

api.interceptors.request.use();
api.interceptors.response.use();

export default api;
