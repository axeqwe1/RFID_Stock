import type { Companies } from "../../ui/types/Companies";

export class CompanyEntity {
  private _companies: Companies[];
  constructor(companies: Companies[]) {
    this._companies = [...companies];
  }

  GetCompanies(): Companies[] {
    return [...this._companies];
  }
}
