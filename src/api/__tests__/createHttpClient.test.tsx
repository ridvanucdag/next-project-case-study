import axios from "axios";
import axiosRetry from "axios-retry";
import { createHttpClient } from "../createHttpClient";
import setupHttpInterceptors from "../setupHttpInterceptors";
import LoggerService from "../../providers/loggerService/loggerService";
import { QueryOptions } from "../createHttpClient.types";

jest.mock("axios-retry");
jest.mock("../setupHttpInterceptors");
jest.mock("../../providers/loggerService/loggerService");

describe("createHttpClient", () => {
  const mockedAxiosCreate = jest.fn();
  (axios.create as jest.Mock) = mockedAxiosCreate;

  const mockedAxiosRetry = axiosRetry as unknown as jest.Mock;

  const mockedSetupInterceptors = setupHttpInterceptors as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const fakeAxiosInstance = {
      defaults: {
        timeout: 0,
        headers: { common: {} },
      },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    mockedAxiosCreate.mockReturnValue(fakeAxiosInstance);
  });

  it("should create axios instance with correct baseURL", () => {
    const baseURL = "https://example.com/api";
    createHttpClient(baseURL);
    expect(mockedAxiosCreate).toHaveBeenCalledWith({ baseURL });
  });

  it("should setup axios-retry with correct options", () => {
    createHttpClient("https://example.com/api");

    expect(mockedAxiosRetry).toHaveBeenCalledTimes(1);
    const optionsArg = mockedAxiosRetry.mock.calls[0][1];

    expect(typeof optionsArg.retryDelay).toBe("function");
    expect(optionsArg.retries).toBe(QueryOptions.RETRY);
    expect(optionsArg.shouldResetTimeout).toBe(true);
    expect(typeof optionsArg.retryCondition).toBe("function");

    const fakeError = new Error("fail");
    optionsArg.retryCondition(fakeError);
    expect(LoggerService.logRetryError).toHaveBeenCalledWith(fakeError);
  });

  it("should set default timeout and content-type headers", () => {
    const client = createHttpClient("https://example.com/api");

    expect(client.defaults.timeout).toBe(30000);
    expect(client.defaults.headers.common["Content-Type"]).toBe("application/json");
  });

  it("should call setupHttpInterceptors with created axios instance", () => {
    createHttpClient("https://example.com/api");

    expect(mockedSetupInterceptors).toHaveBeenCalledWith(mockedAxiosCreate.mock.results[0].value);
  });
});
