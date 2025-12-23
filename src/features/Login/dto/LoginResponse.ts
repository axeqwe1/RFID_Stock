export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  userName: string;
  fullName: string;
  companyCode: string;
  companyName: string;
}
