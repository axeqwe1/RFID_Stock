import axios from "axios";
import { apiService, rfidService } from "../service";
import { useMaster } from "@/stores/MasterStore";
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

export const startRfid = async (ip: string, port: string) => {
  try {
    const IPConf = `${ip}:${port}`;
    const res = await rfidService.post("/rfidApi/RFID/StartReading", IPConf);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const stopRfid = async (ip: string, port: string) => {
  try {
    const IPConf = `${ip}:${port}`;
    const res = await rfidService.post("/rfidApi/RFID/StopReading", IPConf);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const CheckEPC = async (EPC: string) => {
  try {
    const res = await rfidService.get("/rfidApi/RFID/CheckEPC/" + EPC);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
