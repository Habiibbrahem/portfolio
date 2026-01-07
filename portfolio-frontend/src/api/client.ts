// src/api/client.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

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
            console.log('401 detected → attempting token refresh');

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.log('No refresh token → forcing logout');
                isRefreshing = false;
                processQueue(error, null);
                localStorage.clear();
                window.location.href = '/admin/login';
                return Promise.reject(error);
            }

            try {
                // FIXED: Use `api` instance for refresh (correct baseURL + interceptors)
                const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken });

                const newAccessToken = data.access_token || data.accessToken;
                const newRefreshToken = data.refresh_token || data.refreshToken;

                localStorage.setItem('accessToken', newAccessToken);
                if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

                console.log('Token refreshed successfully');

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                isRefreshing = false;

                return api(originalRequest);
            } catch (refreshError: any) {
                console.error('Refresh token failed:', refreshError.response?.data || refreshError.message);

                processQueue(refreshError, null);
                isRefreshing = false;

                // Force logout on refresh failure
                localStorage.clear();
                window.location.href = '/admin/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;