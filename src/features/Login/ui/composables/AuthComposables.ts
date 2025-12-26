import type { LoginRequest } from "@/dto/request/Request";
import { AuthRepository } from "../../repository/AuthRepo";
import { AuthService } from "../../service/AuthService";
import type { AuthEntity } from "../../domain/entity/AuthEntity";

export const useAuth = () => {
  const repo = new AuthRepository();
  const service = new AuthService(repo);
  const login = async (req: LoginRequest) => {
    // Login
    const res = await service.Login(req);
    res.SaveToken();
    return res;
  };
  const logout = async (auth: AuthEntity | null) => {
    if (auth) {
      console.log(auth);
      auth.RemoveToken();
    }
  };
  return { login, logout };
};
