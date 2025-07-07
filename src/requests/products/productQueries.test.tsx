import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useProductQuery,
  useSingleProductQuery,
  usePaginatedProductsQuery,
} from "./product.query";
import { httpClient } from "../../api/createHttpClient";
import { HttpMethod } from "../../api/createHttpClient.types";
import { Product } from "./product.types";

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

describe("Product Queries", () => {
  const mockedHttpClient = httpClient as jest.MockedFunction<typeof httpClient>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("useProductQuery calls httpClient with correct params and returns data", async () => {
    const mockData: Product[] = [
      {
        id: 1,
        title: "Product 1",
        price: 10,
        description: "desc",
        category: "cat",
        image: "img1.jpg",
        rating: { rate: 4.5, count: 10 },
      },
      {
        id: 2,
        title: "Product 2",
        price: 20,
        description: "desc2",
        category: "cat2",
        image: "img2.jpg",
        rating: { rate: 4.0, count: 5 },
      },
    ];

    mockedHttpClient.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useProductQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedHttpClient).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: "products",
      data: undefined,
      headers: undefined,
    });

    expect(result.current.data).toEqual(mockData);
  });

  it("useSingleProductQuery calls httpClient with correct id and returns data", async () => {
    const productId = 42;
    const mockProduct = { id: productId, title: "Single Product", price: 100 };

    mockedHttpClient.mockResolvedValueOnce({ data: mockProduct });

    const { result } = renderHook(() => useSingleProductQuery(productId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedHttpClient).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: `products/${productId}`,
      data: undefined,
      headers: undefined,
    });

    expect(result.current.data).toEqual(mockProduct);
  });

  it("usePaginatedProductsQuery calls httpClient with limit and offset and returns data", async () => {
    const limit = 5;
    const offset = 10;
    const mockData = Array.from({ length: limit }).map((_, i) => ({
      id: offset + i + 1,
      title: `Product ${offset + i + 1}`,
      price: (offset + i + 1) * 10,
    }));

    mockedHttpClient.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () => usePaginatedProductsQuery({ limit, offset }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedHttpClient).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: `products?limit=${limit}&offset=${offset}`,
      data: undefined,
      headers: undefined,
    });

    expect(result.current.data).toEqual(mockData);
  });
});
