
import {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

class LoggerService {
  static log(title?: string, ...args: unknown[]): void {
    console.log(title, ...args);
  }

  static info(title?: string, ...args: unknown[]): void {
    console.info(title, ...args);
  }

  static warn(title?: string, ...args: unknown[]): void {
    console.warn(title, ...args);
  }

  static error(title?: string, ...args: unknown[]): void {
    console.error(title, ...args);
  }

  static logApiError(error: AxiosError): void {
    LoggerService.error(
      `API Error ${error.code ?? "UNKNOWN"}: ${error.message}`,
      {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
        timeout: error.config?.timeout,
      } as AxiosRequestConfig
    );
  }

  static logRetryError(error: AxiosError): void {
    LoggerService.error(
      `Retry API Error ${error.code ?? "UNKNOWN"}: ${error.message}`,
      {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        timeout: error.config?.timeout,
      } as AxiosRequestConfig
    );
  }

  static logApiRequest(config: InternalAxiosRequestConfig): void {
    LoggerService.info("API Request", {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      auth: config.auth,
      body: config.data || "",
    } as AxiosRequestConfig);
  }
}

export default LoggerService;
