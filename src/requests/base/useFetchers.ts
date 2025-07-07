import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { ApiMutationOptions, ApiQueryOptions } from './fetcher.types';
import { HttpMethod } from '../../api/createHttpClient.types';
import { httpClient } from '../../api/createHttpClient';

export const useApiQuery = <T>({
  method = HttpMethod.GET,
  path,
  params,
  headers,
  ...queryOptions
}: ApiQueryOptions<AxiosResponse<T>>): UseQueryResult<T> => {
  const query = useQuery({
    ...queryOptions,
    queryFn: () =>
      httpClient({
        method,
        url: path,
        data: params,
        headers,
      }),
    select: (data: AxiosResponse<T>) => data.data,
    retry: false,
  });
  return query;
};

export const useApiMutation = <T>({
  path,
  params,
  method = HttpMethod.GET,
  ...mutationOptions
}: ApiMutationOptions<AxiosResponse<T>>): UseMutationResult<
  AxiosResponse<T>,
  Error,
  void,
  unknown
> => {
  return useMutation({
    mutationFn: mutationParams =>
      httpClient({
        method,
        url: path,
        data: params || mutationParams,
      }),
    ...mutationOptions,
    retry: false,
  });
};