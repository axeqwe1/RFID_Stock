import type { Response } from "@/dto/response/Response";
import type { FPSProductOnlineEntity } from "../domain/entities/FPSProductOnlineEntity";
import type { IFPSProductOnlineRepositroy } from "../domain/interface/IRepository";
import { apiService } from "@/lib/service";

export class FPSProductOnlineRepositroy implements IFPSProductOnlineRepositroy {
  private readonly API_PATH: string = "/rfidApi/FPSProductOnline/";
  // Implement repository methods here
  async GetAll(): Promise<FPSProductOnlineEntity> {
    try {
      const res = await apiService.get(this.API_PATH + "GetWithDetail");

      return res.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
