import { apiService } from "@/lib/service";
import type { OutstockRequest, ScanOutStockRequest } from "./outstock.model";

const API_PATH = "/rfidApi/FPSProductOnline/";

export const fetchOption = async () => {
  try {
    const res = await apiService.get(API_PATH + "Gets");
    return res.data;
  } catch (error) {
    return error;
  }
};

export const checkDetail = async (
  itemCode: string,
  colorCode: string,
  size: string
) => {
  try {
    const res = await apiService.get(
      API_PATH +
        `CheckDetail?ItemCode=${itemCode}&ColorCode=${colorCode}&Size=${size}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUOM = async (
  itemCode: string,
  colorCode: string,
  size: string
) => {
  try {
    const res = await apiService.get(
      API_PATH +
        `GetUOM?ItemCode=${itemCode}&ColorCode=${colorCode}&Size=${size}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const createRequestOutstock = async (req: OutstockRequest) => {
  try {
    const res = await apiService.post(
      "/rfidApi/FPSWarehouse/CreateRequestOutstock",
      req
    );
    return res.data;
  } catch (err: any) {
    return err;
  }
};

export const PODescApi = () => {
  const api = "/rfidApi/PODesc/OutOptions";

  const fetchPODescOption = async () => {
    try {
      const res = await apiService.get(api);
      return res.data;
    } catch (error) {
      return error;
    }
  };

  return { fetchPODescOption };
};

export const CheckEPCOutStock = async (
  EPC: string,
  request: ScanOutStockRequest
) => {
  try {
    const res = await apiService.post(
      "/rfidApi/RFID/" + `CheckEPCOutStock/${EPC}`,
      request
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const warehouseInOutType = () => {
  const api = "/rfidApi/FPSWarehouseInOutType/";

  const fetchInOutType = async () => {
    try {
      const res = await apiService.get(api + "OutOptions");
      return res.data;
    } catch (error) {
      return error;
    }
  };

  return { fetchInOutType };
};

export const AutorunOutNo = async (company: string) => {
  try {
    const res = await apiService.get(
      "/rfidApi/FPSWarehouse/AutoRunOutNo/" + company
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
