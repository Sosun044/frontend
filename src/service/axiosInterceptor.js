import axios from "axios";
import { getAccessToken, getRefreshToken, saveAccessToken } from "./authService";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refresh = getRefreshToken();
                const res = await axios.post("http://localhost:8080/refreshToken", {
                    refreshToken: refresh,
                });

                const newAccessToken = res.data.data.accessToken;
                saveAccessToken(newAccessToken);

                // Yeni token ile tekrar isteği gönder
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                toast.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
                localStorage.clear();
                window.location.href = "/auth/sign-in";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
