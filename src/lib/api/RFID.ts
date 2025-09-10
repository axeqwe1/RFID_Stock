import axios from "axios";
import { apiService } from "../axios";
// import type { LoginRequest } from "@/data/dto/request/auth";

// export const login = async (data: LoginRequest) => {
//   try {
//     const res = await apiService.post("/api/Auth/login", data);
//     return res;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

export const startRfid = async () => {
  try {
    const res = await apiService.post("/rfidApi/RFID/StartReading", {});
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const stopRfid = async () => {
  try {
    const res = await apiService.post("/rfidApi/RFID/StopReading", {});
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
