import type { CreateWarehouseReceiveRequest } from "./../dto/CreateWarehouseReceiveDTO";
import type { IFPSWarehouseRepository } from "../domain/interface/IRepository";

export class FPSWarehouseService {
  private readonly _repo: IFPSWarehouseRepository;

  constructor(repo: IFPSWarehouseRepository) {
    this._repo = repo;
  }

  async GetAllFPSWarehouse() {
    const data = await this._repo.GetAll();
    return data;
  }

  async GetOptions(company: string) {
    const data = await this._repo.GetOptions(company);
    return data;
  }

  async GetReceiveIn(receiveNo: string) {
    const res = await this._repo.GetReceiveIn(receiveNo);
    return res;
  }

  async CreateWarehouseReceiveRequest(request: CreateWarehouseReceiveRequest) {
    try {
      await this._repo.CreateWarehouseReceive(request);
    } catch (error: any) {
      throw new Error(error?.message || "Service error");
    }
  }

  async UpdateWarehouseReceiveRequest(
    receiveNo: string,
    request: CreateWarehouseReceiveRequest
  ) {
    await this._repo.UpdateWarehouseReceive(receiveNo, request);
  }

  async DeleteWarehouseReceive(receiveNo: string) {
    const res = await this._repo.DeleteWarehouseReceive(receiveNo);
    return res;
  }
  async GetWarehouseRfid() {
    const res = await this._repo.GetRFIDs();
    return res.data;
  }
}
