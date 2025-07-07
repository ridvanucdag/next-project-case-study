
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';
import { HttpMethod } from '../../api/createHttpClient.types';

export type ApiQueryOptions<T> = UseQueryOptions<T> & {
  method?: HttpMethod;
  path: string;
  params?: object;
  headers?: Record<string, string>;
};

export type ApiMutationOptions<T> = UseMutationOptions<T> & {
  method?: HttpMethod;
  path: string;
  params?: object;
};

export type ApiMutationReturn<
  T,
  V = Error,
  Y = void,
  Z = unknown,
> = UseMutationResult<AxiosResponse<T>, V, Y, Z>;
