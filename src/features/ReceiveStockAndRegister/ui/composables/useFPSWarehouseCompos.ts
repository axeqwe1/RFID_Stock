import { apiService } from "@/lib/service";
import { FPSWarehouseRepository } from "../../repositroy/FPSWarehouseRepository";
import { FPSWarehouseService } from "../../service/FPSWarehouseService";
import type { CreateWarehouseReceiveRequest } from "../../dto/CreateWarehouseReceiveDTO";

export const useFPSWarehouseCompos = () => {
  const repository = new FPSWarehouseRepository();
  const service = new FPSWarehouseService(repository);

  const GetAllFPSWarehouseData = async () => {
    try {
      const data = await service.GetAllFPSWarehouse();
      console.log(data);
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  const GetWarehouseOptions = async () => {
    try {
      const data = await service.GetOptions("FPSTH");
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  const GetAutorunReceiveInNo = async (company: string) => {
    try {
      const res = await apiService.get(
        `/rfidApi/FPSWarehouse/AutoRunReceiveNo/${company}`
      );
      return res.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const CreateWarehouseReceive = async (
    request: CreateWarehouseReceiveRequest
  ) => {
    try {
      await service.CreateWarehouseReceiveRequest(request);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const UpdateWarehouseReceive = async (
    receiveNo: string,
    request: CreateWarehouseReceiveRequest
  ) => {
    try {
      await service.UpdateWarehouseReceiveRequest(receiveNo, request);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const DeleteWarehouseReceive = async (receiveNo: string) => {
    const res = await service.DeleteWarehouseReceive(receiveNo);
    return res;
  };

  const GetReceiveIn = async (receiveNo: string) => {
    try {
      const res = await service.GetReceiveIn(receiveNo);
      return res;
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const GetWarehouseRfids = async () => {
    const res = await service.GetWarehouseRfid();
    return res;
  };

  return {
    GetAllFPSWarehouseData,
    GetWarehouseOptions,
    GetAutorunReceiveInNo,
    CreateWarehouseReceive,
    UpdateWarehouseReceive,
    GetReceiveIn,
    GetWarehouseRfids,
    DeleteWarehouseReceive,
  };
};
