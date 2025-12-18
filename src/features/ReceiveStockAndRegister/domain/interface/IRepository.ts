import type { Response } from "@/dto/response/Response";
import type { FPSWarehouseEntity } from "../entities/FPSWarehouseEntity";
import type { RFIDEntity } from "../entities/RFIDEntity";
import type { FPSProductOnlineEntity } from "../entities/FPSProductOnlineEntity";
import type { FPSProductOnlineTransEntity } from "../entities/FPSProductOnlineTransEntity";
import type {
  CreateWarehouseReceiveRequest,
  WarehouseRFIdItem,
} from "../../dto/CreateWarehouseReceiveDTO";
import type { WarehouseReceiveInDTO } from "../../dto/WarehouseReceiveInDTO";

export interface IRFIDRepository {
  GetAll: () => Promise<RFIDEntity>;
}

export interface IFPSWarehouseRepository {
  GetAll: () => Promise<FPSWarehouseEntity>;
  GetOptions: (company: string) => Promise<FPSWarehouseEntity>;
  GetRFIDs: () => Promise<Response<WarehouseRFIdItem[]>>;
  CreateWarehouseReceive: (
    request: CreateWarehouseReceiveRequest
  ) => Promise<void>;
  UpdateWarehouseReceive: (
    receiveNo: string,
    request: CreateWarehouseReceiveRequest
  ) => Promise<void>;
  DeleteWarehouseReceive: (receiveNo: string) => Promise<Response<string>>;
  GetReceiveIn: (
    receiveNo: string
  ) => Promise<Response<WarehouseReceiveInDTO[]>>;
}

export interface IFPSProductOnlineRepositroy {
  GetAll: () => Promise<FPSProductOnlineEntity>;
}

export interface IFPSProductTransactionRepository {
  GetAll: () => Promise<FPSProductOnlineTransEntity>;
}
