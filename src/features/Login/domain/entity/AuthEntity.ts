import type { LoginResponse, UserInfo } from "../../dto/LoginResponse";

export class AuthEntity {
  private _user: LoginResponse;
  constructor(user: LoginResponse) {
    this._user = user;
  }

  Response(): LoginResponse {
    return this._user;
  }
  GetUserData(): UserInfo {
    return this._user.user;
  }
  SaveToken() {
    localStorage.setItem("access_token", this._user.token);
  }
  RemoveToken() {
    if (localStorage.getItem("access_token")) {
      localStorage.removeItem("access_token");
    }
  }
}
