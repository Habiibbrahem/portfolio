// src/api/client.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    console.log('→ Request:', config.url, token ? 'with token' : 'NO TOKEN');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('401 → Trying refresh token...');
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            console.log('Refresh token exists:', !!refreshToken);

            if (!refreshToken) {
                console.log('No refresh token → force logout');
                processQueue(error, null);
                isRefreshing = false;
                localStorage.clear();
                window.location.href = '/admin/login';
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post('http://localhost:3000/auth/refresh', { refresh_token: refreshToken });
                const newToken = data.accessToken;
                const newRefresh = data.refreshToken;

                localStorage.setItem('accessToken', newToken);
                if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

                console.log('Token refreshed successfully!');

                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                processQueue(null, newToken);
                isRefreshing = false;
                return api(originalRequest);
            } catch (refreshError: any) {
                console.error('Refresh failed:', refreshError.response?.data || refreshError);
                processQueue(refreshError, null);
                isRefreshing = false;
                localStorage.clear();
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;