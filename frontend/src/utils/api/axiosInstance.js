import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:1555',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor untuk menyertakan token jika ada
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
