export interface ApiResponse<T> {
  code: number;
  error: boolean;
  message: string;
  data: T;
}
