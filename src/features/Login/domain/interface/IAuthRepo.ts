import type { LoginRequest } from "@/dto/request/Request";
import type { LoginResponse } from "../../dto/LoginResponse";
import type { AuthEntity } from "../entity/AuthEntity";

export interface IAuthRepository {
  Login: (req: LoginRequest) => Promise<AuthEntity>;
}
