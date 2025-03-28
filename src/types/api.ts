export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
}
