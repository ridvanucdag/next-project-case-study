import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";

import setupHttpInterceptors, {
  addAuthHeader,
  handleRequestError,
  handleResponseSuccess,
  handleResponseError,
} from "../setupHttpInterceptors";

import LoggerService from "../../providers/loggerService/loggerService";

jest.mock("../../providers/loggerService/loggerService");

interface SimpleInterceptorManager<T> {
  use(
    onFulfilled?: (value: T) => T | Promise<T>,
    onRejected?: (error: unknown) => unknown
  ): number;
  eject(id: number): void;
}

function createInterceptorManagerMock<T>(): SimpleInterceptorManager<T> {
  return {
    use: jest.fn(),
    eject: jest.fn(),
  };
}

describe("setupHttpInterceptors", () => {
  const mockHttpClient = {
    interceptors: {
      request: createInterceptorManagerMock<InternalAxiosRequestConfig>(),
      response: createInterceptorManagerMock<AxiosResponse>(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registers request and response interceptors correctly", () => {
    setupHttpInterceptors(mockHttpClient as unknown as AxiosInstance);

    expect(mockHttpClient.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(mockHttpClient.interceptors.response.use).toHaveBeenCalledTimes(1);

    const [reqSuccess, reqError] = (mockHttpClient.interceptors.request.use as jest.Mock).mock.calls[0];
    expect(typeof reqSuccess).toBe("function");
    expect(typeof reqError).toBe("function");

    const [resSuccess, resError] = (mockHttpClient.interceptors.response.use as jest.Mock).mock.calls[0];
    expect(typeof resSuccess).toBe("function");
    expect(typeof resError).toBe("function");
  });
});

describe("interceptor handler functions", () => {
  it("addAuthHeader logs and returns config", async () => {
    const config = { url: "/test" } as InternalAxiosRequestConfig;
    const result = await addAuthHeader(config);
    expect(LoggerService.logApiRequest).toHaveBeenCalledWith(config);
    expect(result).toBe(config);
  });

  it("handleRequestError rejects with error", async () => {
    const error = new Error("request error") as AxiosError;
    await expect(handleRequestError(error)).rejects.toThrow("request error");
  });

  it("handleResponseSuccess returns response", () => {
    const response = { data: "ok" } as AxiosResponse;
    expect(handleResponseSuccess(response)).toBe(response);
  });

  it("handleResponseError logs error and rejects", async () => {
    const error = new Error("response error") as AxiosError;
    const mockLog = LoggerService.logApiError as jest.Mock;
    mockLog.mockClear();
    await expect(handleResponseError(error)).rejects.toThrow("response error");
    expect(mockLog).toHaveBeenCalledWith(error);
  });
});
