export interface CollectionResponse<T> {
  items: T[];
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
