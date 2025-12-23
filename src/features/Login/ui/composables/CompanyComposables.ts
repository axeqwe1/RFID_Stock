import { CompaniesRepository } from "../../repository/CompaniesRepo";
import { CompanyService } from "../../service/CompanyService";

export const useCompany = () => {
  const repo = new CompaniesRepository();
  const service = new CompanyService(repo);

  const GetCompanies = async () => {
    return await service.GetCompany();
  };

  return { GetCompanies };
};
