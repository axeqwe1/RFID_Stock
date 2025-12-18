import type { IRFIDRepository } from "../domain/interface/IRepository";

export class RFIDService {
  private _repo: IRFIDRepository;

  constructor(repo: IRFIDRepository) {
    this._repo = repo;
  }

  async GetAllRFID() {
    const data = await this._repo.GetAll();
    return data.GetAllRFID();
  }
}
