import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

const refreshToken = async () => {
    try {
        const response = await axios.post('http://localhost:3000/auth/refresh_token', {}, {
            withCredentials: true
        });
        if (response.data && response.data.accessToken) {
            localStorage.setItem('jsonwebtoken', response.data.accessToken);
            return response.data;
        } else {
            console.log("Hej");
            throw new Error("No access token in response");
        }
    } catch (err) {
        console.error("Refresh token error:", err);
        throw err;
    }
};

api.interceptors.request.use(async (config) => {

    if (config.url === '/api/login' || config.url === '/auth/refresh_token' || config.url === '/api/logout') {
        return config;
    }

    const token = localStorage.getItem('jsonwebtoken');
    if(!token) {
        try {
        const response = await refreshToken();
            if (response && response.accessToken)
                config.headers['Authorization'] = "Bearer " + response.accessToken;
        } catch (err) {
            console.log("No token available and refresh failed: " + err);
        }
    }
    else {
        let currentDate = new Date();
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            try {
                const response = await refreshToken();
                if (response && response.accessToken) 
                    config.headers['Authorization'] = "Bearer " + response.accessToken;
            } catch (err) {
                console.log("Token expired and refresh failed: " + err);
            }
        }
        else 
            config.headers['Authorization'] = "Bearer " + token;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


export default api;