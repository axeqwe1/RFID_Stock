import type { ICompaniesRepo } from "../domain/interface/ICompaniesRepo";

export class CompanyService {
  private _repo: ICompaniesRepo;
  constructor(repo: ICompaniesRepo) {
    this._repo = repo;
  }

  async GetCompany() {
    const res = await this._repo.GetCompanies();
    return res;
  }
}
