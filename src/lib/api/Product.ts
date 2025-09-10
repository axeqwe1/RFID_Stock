import axios from "axios";
import { apiService } from "../axios";
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
const API_PATH = "/rfidApi/Product/";

export const GetProductData = async () => {
  try {
    const res = await apiService.get(API_PATH + "GetProductData");
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const GetProductRFID = async (sku: string) => {
  try {
    const res = await apiService.get(API_PATH + "GetProductRFID?EPC=" + sku);
    return res;
  } catch (err: any) {
    throw err;
  }
};

export const GetAllProductRFID = async () => {
  try {
    const res = await apiService.get(API_PATH + "GetAllProductRFID");
    return res;
  } catch (err: any) {
    throw err;
  }
};

export const AddRfidToProduct = async (request: AddRfidRequest[]) => {
  try {
    console.log(request);
    const res = await apiService.post(API_PATH + "AddRfidToProduct", request);
    return res;
  } catch (err) {
    console.error(err);
    return err;
  }
};
