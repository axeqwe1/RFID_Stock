import { apiService } from "@/lib/service";

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
