import { apiService } from "@/lib/service";
import type { IFPSProductTransactionRepository } from "../domain/interface/IRepository";
import type { ProductTransactionResult } from "../types/productOnlineType";

export class FPSProductOnlineTransService {
  private _repo: IFPSProductTransactionRepository;
  constructor(repo: IFPSProductTransactionRepository) {
    this._repo = repo;
  }

  async GetAll() {
    const data = await this._repo.GetAll();
    return data;
  }
}
