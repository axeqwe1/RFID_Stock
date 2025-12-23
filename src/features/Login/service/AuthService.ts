import type { LoginRequest } from "@/dto/request/Request";
import type { AuthRepository } from "../repository/AuthRepo";

export class AuthService {
  private readonly _repo: AuthRepository;
  constructor(repo: AuthRepository) {
    this._repo = repo;
  }

  async Login(req: LoginRequest) {
    return this._repo.Login(req);
  }
}
