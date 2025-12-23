import type { Result } from "@/dto/response/Response";
import type { Companies } from "../../ui/types/Companies";
import type { CompanyEntity } from "../entity/CompanyEntity";

export interface ICompaniesRepo {
  GetCompanies: () => Promise<Result<CompanyEntity>>;
}
