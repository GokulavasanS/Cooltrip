export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
}
