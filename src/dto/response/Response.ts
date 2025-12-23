import type { RepoErrorType } from "@/features/ReceiveStockAndRegister/types/RepoErrorType";

export interface Response<T> {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: T;
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: RepoErrorType };
