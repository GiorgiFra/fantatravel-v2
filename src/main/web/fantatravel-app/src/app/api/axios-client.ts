import axios from 'axios';
import { showGlobalError } from '../utils/showGlobalError'; // vedi sotto

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const errorType = error.response?.data?.error;

        if (status === 401 && !originalRequest._retry) {
            if (errorType === 'InvalidCredentials') {
                return Promise.reject(error);
            }

            if (errorType === 'TokenExpired' || !errorType) {
                originalRequest._retry = true;
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) throw new Error('No refresh token available');

                    const { data } = await axiosInstance.post('/auth/refresh', { token: refreshToken });

                    localStorage.setItem('token', data.token);
                    localStorage.setItem('refreshToken', data.refreshToken ?? refreshToken);

                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                    originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/fantatravel/app/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        // 🌍 Mostra errore globale generico se non gestito sopra
        if (!axios.isCancel(error) && error.status === 500) {
            const msg = error.response?.data?.message || 'Errore di rete o del server.';
            showGlobalError(msg);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
