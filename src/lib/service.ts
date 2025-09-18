import createAxiosInstance from "./axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const RFID_API_URL = import.meta.env.VITE_RFID_API_URL;

if (!API_BASE_URL || !RFID_API_URL) {
  throw new Error("API environment variables are not defined in .env");
}

export const apiService = createAxiosInstance(API_BASE_URL);
export const rfidService = createAxiosInstance(RFID_API_URL);
