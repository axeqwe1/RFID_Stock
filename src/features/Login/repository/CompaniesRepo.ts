import type { Companies } from "./../ui/types/Companies";
import type { ICompaniesRepo } from "./../domain/interface/ICompaniesRepo";
import { apiService } from "@/lib/service";
import { CompanyEntity } from "../domain/entity/CompanyEntity";
import type { Result } from "@/dto/response/Response";
import { RepoErrorType } from "@/features/ReceiveStockAndRegister/types/RepoErrorType";

export class CompaniesRepository implements ICompaniesRepo {
  private readonly API_PATH = "api/Auth/";
  constructor() {}

  async GetCompanies(): Promise<Result<CompanyEntity>> {
    try {
      const res = await apiService.get(this.API_PATH + "companies");
      return { ok: true, value: new CompanyEntity(res.data) };
    } catch (e: any) {
      const status = e.response?.status;

      if (status === 401) {
        return { ok: false, error: RepoErrorType.Unauthorized };
      }

      if (!status) {
        return { ok: false, error: RepoErrorType.Network };
      }

      return { ok: false, error: RepoErrorType.Server };
    }
  }
}
