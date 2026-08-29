import type { User } from '../types/user';
import { apiClient } from './client';

export const getCurrentUser = async () => {
  const response = await apiClient.get<User>('/me');

  return response.data;
};
