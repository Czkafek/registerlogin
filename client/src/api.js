import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

const refreshToken = async () => {
    try {
        const respone = await axios.post('http://localhost:300/auth/refresh_token', {}, {
            withCredentials: true
        })
        localStorage.setItem('jsonwebtoken', response.data.accessToken);
        return response.data.accessToken;
    } catch (err) {
        throw err;
    }
};

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jsonwebtoken');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return configl
    },
    error => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });

    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                processQueue(null, newToken);
                isRefreshing = false;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                localStorage.removeItem('jsonwebtoken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
    }
);

export default api;