import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post(`${baseURL}/auth/renew`, {
            refresh_token: cookies.get("refresh_token")
        }, {
            withCredentials: true
        });
        const { access_token } = response.data;
        cookies.set("access_token", access_token, { path: '/' });
        return access_token;
    } catch (error) {
        return null;
    }
};

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = cookies.get("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setupInterceptors = (logout: (callApi?: boolean) => void) => {
    console.log("setupInterceptors")
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
            
            if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
                logout(false);
                return Promise.reject(error);
            }
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return axiosInstance(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    processQueue(null, newToken);
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }
                    return axiosInstance(originalRequest);
                } else {
                    throw new Error('Failed to refresh token');
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                logout(false);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );
};

export default axiosInstance;