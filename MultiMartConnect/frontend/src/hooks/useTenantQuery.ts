import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../services/api.client';

export function useTenantFetchData<TResponse>(
  queryUniqueIdKey: string[], 
  endpointTargetUrl: string, 
  configOptions?: Omit<UseQueryOptions<TResponse, Error, TResponse, any>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TResponse, Error>({
    queryKey: queryUniqueIdKey,
    queryFn: async () => {
      const response = await apiClient.get<TResponse>(endpointTargetUrl);
      return response.data;
    },
    ...configOptions,
  });
}