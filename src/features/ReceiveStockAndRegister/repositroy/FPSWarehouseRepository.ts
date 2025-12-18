import type {
  CreateWarehouseReceiveRequest,
  WarehouseRFIdItem,
} from "./../dto/CreateWarehouseReceiveDTO";
import { apiService } from "@/lib/service";
import { FPSWarehouseEntity } from "../domain/entities/FPSWarehouseEntity";
import type { IFPSWarehouseRepository } from "../domain/interface/IRepository";
import type { Response } from "@/dto/response/Response";
import type { MasterWarehouseFPS } from "../types/warehouseFpsType";
import type { WarehouseReceiveInDTO } from "../dto/WarehouseReceiveInDTO";

export class FPSWarehouseRepository implements IFPSWarehouseRepository {
  private readonly API_PATH: string = "/rfidApi/FPSWarehouse/";

  async GetAll(): Promise<FPSWarehouseEntity> {
    try {
      const res = await apiService.get(this.API_PATH + "Gets");

      return new FPSWarehouseEntity(res.data);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async GetOptions(company: string): Promise<FPSWarehouseEntity> {
    try {
      const res = await apiService.get<Response<MasterWarehouseFPS[]>>(
        this.API_PATH + `Gets/Options/${company}`
      );

      if (!res.data.isSuccess) {
        throw new Error(res.data.message);
      }

      return new FPSWarehouseEntity(res.data.data); // <-- ใช้เฉพาะ data array
    } catch (error: any) {
      throw new Error(error?.message || "API error");
    }
  }

  async CreateWarehouseReceive(
    request: CreateWarehouseReceiveRequest
  ): Promise<void> {
    try {
      await apiService.post(this.API_PATH + "CreateReceiveInNo", request);
    } catch (error: any) {
      throw new Error(error?.message || "API error");
    }
  }
  async UpdateWarehouseReceive(
    receiveNo: string,
    request: CreateWarehouseReceiveRequest
  ): Promise<void> {
    try {
      await apiService.put(
        this.API_PATH + "UpdateReceiveInNo/" + receiveNo,
        request
      );
    } catch (error: any) {
      throw new Error(error?.message || "API error");
    }
  }
  async DeleteWarehouseReceive(receiveNo: string): Promise<Response<string>> {
    try {
      const res = await apiService.delete(
        this.API_PATH + "DeleteReceiveInNo/" + receiveNo
      );
      return res.data;
    } catch (error: any) {
      throw new Error(error?.message || "API error");
    }
  }
  async GetReceiveIn(
    receiveNo: string
  ): Promise<Response<WarehouseReceiveInDTO[]>> {
    try {
      const res = await apiService.get<Response<WarehouseReceiveInDTO[]>>(
        this.API_PATH + "GetReceiveByNo/" + receiveNo
      );

      return res.data;
    } catch (err: any) {
      throw new Error(err?.message || "API error");
    }
  }

  async GetRFIDs(): Promise<Response<WarehouseRFIdItem[]>> {
    try {
      const res = await apiService.get(this.API_PATH + "GetWarehouseRfid");

      return res.data;
    } catch (err: any) {
      throw new Error(err?.message || "API error");
    }
  }
}
