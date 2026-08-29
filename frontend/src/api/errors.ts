import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/api';

export const isApiError = (error: unknown, status: number, code?: string) => {
  if (!isAxiosError<ApiErrorResponse>(error) || error.response?.status !== status) {
    return false;
  }

  return code === undefined || error.response.data.error.code === code;
};
