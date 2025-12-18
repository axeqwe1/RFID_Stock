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
