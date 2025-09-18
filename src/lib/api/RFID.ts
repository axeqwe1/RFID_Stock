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
const store = useMaster();
const IPConf = `${store.IP}:${store.PORT}`;
export const startRfid = async () => {
  try {
    console.log(IPConf);
    const res = await rfidService.post("/rfidApi/RFID/StartReading", IPConf);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const stopRfid = async () => {
  try {
    console.log(IPConf);
    const res = await rfidService.post("/rfidApi/RFID/StopReading", IPConf);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
