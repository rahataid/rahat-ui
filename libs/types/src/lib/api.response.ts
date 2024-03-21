export interface ApiResponse<T> {
  data: T;
  error: string;
  message: string;
  status: number;
  success: boolean;
}
export interface PaginatedRequestPayload {
  page?: number | null;
  perPage?: number | null;
  sort?: string | null;
  order?: string | null;
}
