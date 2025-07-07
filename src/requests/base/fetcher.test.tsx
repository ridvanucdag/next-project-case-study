import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "./useFetchers";
import { httpClient } from "../../api/createHttpClient";
import { HttpMethod } from "../../api/createHttpClient.types";

jest.mock("../../api/createHttpClient", () => ({
  httpClient: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "TestQueryClientProviderWrapper";

  return Wrapper;
};

describe("useApiQuery hook", () => {
  const mockedHttpClient = httpClient as jest.MockedFunction<typeof httpClient>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call httpClient with correct GET params and return data", async () => {
    const data = { message: "success" };
    mockedHttpClient.mockResolvedValueOnce({ data });

    const { result } = renderHook(
      () =>
        useApiQuery({
          queryKey: ["test-query"],
          path: "/test-path",
          method: HttpMethod.GET,
          params: { q: "test" },
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedHttpClient).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: "/test-path",
      data: { q: "test" },
      headers: undefined,
    });

    expect(result.current.data).toEqual(data);
  });

  it("should handle headers and retry option", async () => {
    const data = { foo: "bar" };
    mockedHttpClient.mockResolvedValueOnce({ data });

    const headers = { Authorization: "Bearer token" };

    const { result } = renderHook(
      () =>
        useApiQuery({
          queryKey: ["header-test"],
          path: "/header-test",
          headers,
          retry: 2,
        }),
      { wrapper: createWrapper() }
    );

       await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedHttpClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/header-test",
        headers,
      })
    );
    expect(result.current.data).toEqual(data);
  });
});

describe("useApiMutation hook", () => {
  const mockedHttpClient = httpClient as jest.MockedFunction<typeof httpClient>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call httpClient with mutation params and return data", async () => {
    const responseData = { updated: true };
    mockedHttpClient.mockResolvedValueOnce({ data: responseData });

    const { result } = renderHook(
      () =>
        useApiMutation({
          path: "/update",
          method: HttpMethod.POST,
          params: { static: "value" },
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.mutate();
    });

     await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedHttpClient).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: "/update",
      data: { static: "value" },
    });

    expect(result.current.data?.data).toEqual(responseData);
  });

  it("should override params with mutate argument if provided", async () => {
    const responseData = { done: true };
    mockedHttpClient.mockResolvedValueOnce({ data: responseData });

    const { result } = renderHook(
      () =>
        useApiMutation({
          path: "/override",
          method: HttpMethod.PUT,
        }),
      { wrapper: createWrapper() }
    );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(result.current.mutate as unknown as (variables: Record<string, any>) => void)({
  dynamic: "value",
});

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedHttpClient).toHaveBeenCalledWith({
      method: HttpMethod.PUT,
      url: "/override",
      data: { dynamic: "value" },
    });

    expect(result.current.data?.data).toEqual(responseData);
  });
});
