import LoggerService from "./loggerService";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

describe("LoggerService", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("log should call console.log with given title and args", () => {
    LoggerService.log("Title", "arg1", 123);
    expect(console.log).toHaveBeenCalledWith("Title", "arg1", 123);
  });

  it("info should call console.info with given title and args", () => {
    LoggerService.info("InfoTitle", { foo: "bar" });
    expect(console.info).toHaveBeenCalledWith("InfoTitle", { foo: "bar" });
  });

  it("warn should call console.warn with given title and args", () => {
    LoggerService.warn("WarnTitle", true, 42);
    expect(console.warn).toHaveBeenCalledWith("WarnTitle", true, 42);
  });

  it("error should call console.error with given title and args", () => {
    const err = new Error("fail");
    LoggerService.error("ErrorTitle", err);
    expect(console.error).toHaveBeenCalledWith("ErrorTitle", err);
  });

  describe("logApiError", () => {
    it("logs formatted API error with code and config details", () => {
      const error = {
        code: "500",
        message: "Internal Server Error",
        config: {
          url: "/api/test",
          method: "GET",
          headers: { Authorization: "token" },
          data: { id: 1 },
          timeout: 1000,
        },
      } as AxiosError;

      LoggerService.logApiError(error);

      expect(console.error).toHaveBeenCalledWith(
        "API Error 500: Internal Server Error",
        expect.objectContaining({
          url: "/api/test",
          method: "GET",
          headers: { Authorization: "token" },
          data: { id: 1 },
          timeout: 1000,
        })
      );
    });

    it("uses UNKNOWN if error.code is missing", () => {
      const error = {
        code: undefined,
        message: "Unknown error",
        config: {},
      } as AxiosError;

      LoggerService.logApiError(error);

      expect(console.error).toHaveBeenCalledWith(
        "API Error UNKNOWN: Unknown error",
        expect.any(Object)
      );
    });
  });

  describe("logRetryError", () => {
    it("logs formatted retry error with code and config details", () => {
      const error = {
        code: "429",
        message: "Too Many Requests",
        config: {
          url: "/api/retry",
          method: "POST",
          headers: { Authorization: "token" },
          timeout: 2000,
        },
      } as AxiosError;

      LoggerService.logRetryError(error);

      expect(console.error).toHaveBeenCalledWith(
        "Retry API Error 429: Too Many Requests",
        expect.objectContaining({
          url: "/api/retry",
          method: "POST",
          headers: { Authorization: "token" },
          timeout: 2000,
        })
      );
    });
  });

  describe("logApiRequest", () => {
    it("logs API request info with config details", () => {
      const config = {
        url: "/api/req",
        baseURL: "https://api.example.com",
        method: "PUT",
        auth: { username: "user", password: "pass" },
        data: { key: "value" },
      } as InternalAxiosRequestConfig;

      LoggerService.logApiRequest(config);

      expect(console.info).toHaveBeenCalledWith(
        "API Request",
        expect.objectContaining({
          url: "/api/req",
          baseURL: "https://api.example.com",
          method: "PUT",
          auth: { username: "user", password: "pass" },
          body: { key: "value" },
        })
      );
    });

    it("logs API request with empty body if data is falsy", () => {
      const config = {
        url: "/api/empty",
        baseURL: "https://api.example.com",
        method: "GET",
        auth: undefined,
        data: null,
      } as InternalAxiosRequestConfig;

      LoggerService.logApiRequest(config);

      expect(console.info).toHaveBeenCalledWith(
        "API Request",
        expect.objectContaining({
          url: "/api/empty",
          baseURL: "https://api.example.com",
          method: "GET",
          auth: undefined,
          body: "",
        })
      );
    });
  });
});
