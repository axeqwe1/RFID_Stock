import { apiService } from "@/lib/service";
import type { IAuthRepository } from "../domain/interface/IAuthRepo";
import type { LoginRequest } from "@/dto/request/Request";
import { AuthEntity } from "../domain/entity/AuthEntity";
import type { LoginResponse } from "../dto/LoginResponse";

export class AuthRepository implements IAuthRepository {
  private readonly API_PATH = "api/Auth/";
  constructor() {}

  async Login(req: LoginRequest): Promise<AuthEntity> {
    try {
      // LoginResponse
      const res = await apiService.post<LoginResponse>(
        this.API_PATH + "login",
        req
      );
      return new AuthEntity(res.data);
    } catch (err: any) {
      throw err;
    }
  }
}
