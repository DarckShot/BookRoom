import type { CollectionResponse } from '../types/api';
import type { Office } from '../types/office';
import { apiClient } from './client';

export const getOffices = async () => {
  const response = await apiClient.get<CollectionResponse<Office>>('/offices');

  return response.data.items;
};
