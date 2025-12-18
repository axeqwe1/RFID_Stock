import { apiService } from "@/lib/service";
import type { IFPSProductTransactionRepository } from "../domain/interface/IRepository";
import type { ProductTransactionResult } from "../types/productOnlineType";
import { FPSProductOnlineTransEntity } from "../domain/entities/FPSProductOnlineTransEntity";

export class FPSProductOnlineTransRepository
  implements IFPSProductTransactionRepository
{
  private API_PATH = "/rfidApi/FPSProductOnline/";
  constructor() {}

  async GetAll() {
    try {
      const res = await apiService.get(this.API_PATH + "GetWithDetail");

      return new FPSProductOnlineTransEntity(res.data.data);
    } catch (err: any) {
      throw err;
    }
  }
}
