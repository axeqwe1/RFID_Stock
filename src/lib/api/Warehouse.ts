import axios from "axios";
import { apiService, rfidService } from "../service";
import type { AddRfidRequest } from "@/data/requestDTO/AddRFIDRequest";

const API_PATH = "/rfidApi/Warehouse/";

export async function GetWarehouseStock() {
  try {
    const res = await apiService.get(API_PATH + "GetWarehouseStock");
    return res;
  } catch (error: any) {
    return error;
  }
}
