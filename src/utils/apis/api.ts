import axios, { GenericAbortSignal } from "axios";
import Cookies from "universal-cookie";
import axiosInstance from "./axiosInstance";

const cookies = new Cookies();
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
    return cookies.get("accessToken");
};

const getHeaders = () => {
    return {
        Authorization: `Bearer ${getToken()}`
    };
};

export const protectedApi = {
    GET: async (url: string, params?: any, signal? : GenericAbortSignal) => {
        try {
            const headers = getHeaders();
            const response = await axiosInstance.get(url, { headers, params, signal });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    POST: async (url: string, body?: any) => {
        try {
            const headers = getHeaders();
            const response = await axiosInstance.post(url, body, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    PATCH: async (url: string, body?: any) => {
        try {
            const headers = getHeaders();
            const response = await axiosInstance.patch(url, body, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    DELETE: async (url: string) => {
        try {
            const headers = getHeaders();
            const response = await axiosInstance.delete(url, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    PUT: async (url: string, body?: any) => {
        try {
            const headers = getHeaders();
            const response = await axiosInstance.put(url, body, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
