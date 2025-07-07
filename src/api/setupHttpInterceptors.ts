import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import LoggerService from "../providers/loggerService/loggerService";

export const addAuthHeader = async (
  config: InternalAxiosRequestConfig<unknown>
): Promise<InternalAxiosRequestConfig<unknown>> => {
  LoggerService.logApiRequest(config);
  return config;
};

export const handleRequestError = (error: AxiosError): Promise<never> => {
  return Promise.reject(error);
};

export const handleResponseSuccess = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const handleResponseError = async (
  error: AxiosError
): Promise<AxiosError | AxiosResponse> => {
  LoggerService.logApiError(error);
  return Promise.reject(error);
};

const setupHttpInterceptors = (httpClient: AxiosInstance): void => {
  httpClient.interceptors.request.use(
    (config) => addAuthHeader(config),
    (error) => handleRequestError(error)
  );

  httpClient.interceptors.response.use(
    (response) => handleResponseSuccess(response),
    (error) => handleResponseError(error)
  );
};

export default setupHttpInterceptors;
