import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "X-DisabatinoInc-API-Key": process.env.NEXT_PUBLIC_API_KEY,
    },
});

const scheduleApi: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SCHEDULE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "X-DisabatinoInc-API-Key": process.env.NEXT_PUBLIC_API_KEY,
    },
});

export { api, scheduleApi };
