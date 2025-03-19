import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "X-DisabatinoInc-API-Key": process.env.NEXT_PUBLIC_API_KEY,
    },
});

export default api;
