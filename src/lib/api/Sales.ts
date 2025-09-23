import axios from "axios";
import { apiService, rfidService } from "../service";
import type { AddRfidRequest } from "@/data/requestDTO/AddRFIDRequest";
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
const API_PATH = "/rfidApi/Sales/";

export async function GetSalesDaily() {
  try {
    const res = await apiService.get(API_PATH + "GetSalesDaily");
    return res;
  } catch (error: any) {
    return error;
  }
}
