import { GenericAbortSignal } from "axios";
import axiosInstance from "./axiosInstance";

export const protectedApi = {
    GET: async (url: string, params?: any, signal?: GenericAbortSignal) => {
        try {
            const response = await axiosInstance.get(url, { params, signal });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    POST: async (url: string, body?: any) => {
        try {
            const response = await axiosInstance.post(url, body);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    PATCH: async (url: string, body?: any) => {
        try {
            const response = await axiosInstance.patch(url, body);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    DELETE: async (url: string) => {
        try {
            const response = await axiosInstance.delete(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    PUT: async (url: string, body?: any) => {
        try {
            const response = await axiosInstance.put(url, body);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
