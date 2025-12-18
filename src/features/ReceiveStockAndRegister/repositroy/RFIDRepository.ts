import { apiService } from "@/lib/service";
import type { IRFIDRepository } from "../domain/interface/IRepository";
import { RFIDEntity } from "../domain/entities/RFIDEntity";

export class RFIDRepository implements IRFIDRepository {
  private API_PATH = "/rfidApi/Product/";
  constructor() {}

  async GetAll(): Promise<RFIDEntity> {
    try {
      const res = await apiService(this.API_PATH + "GetProductData");
      return new RFIDEntity(res.data);
    } catch (err: any) {
      throw err;
    }
  }
}
