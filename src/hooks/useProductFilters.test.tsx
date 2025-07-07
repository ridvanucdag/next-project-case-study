import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "../hooks/useProductFilters";
import { Product } from "@/requests/products/product.types";
import * as NextNavigation from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockedUseRouter = NextNavigation.useRouter as jest.Mock;
const mockedUseSearchParams = NextNavigation.useSearchParams as jest.Mock;

describe("useProductFilters", () => {
  let pushMock: jest.Mock;
  const products: Product[] = [
    {
      id: 1,
      title: "Apple iPhone",
      price: 999,
      description: "Smartphone",
      category: "Electronics",
      image: "img1",
      rating: { rate: 4.5, count: 100 },
    },
    {
      id: 2,
      title: "Banana",
      price: 1,
      description: "Fruit",
      category: "Food",
      image: "img2",
      rating: { rate: 4.0, count: 50 },
    },
    {
      id: 3,
      title: "Orange Juice",
      price: 5,
      description: "Beverage",
      category: "Food",
      image: "img3",
      rating: { rate: 3.5, count: 20 },
    },
  ];

  beforeEach(() => {
    pushMock = jest.fn();

    mockedUseRouter.mockReturnValue({ push: pushMock });
    mockedUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
      toString: jest.fn().mockReturnValue(""),
    });
  });

  it("should initialize with empty filter values", () => {
    const { result } = renderHook(() => useProductFilters());

    expect(result.current.category).toBe("");
    expect(result.current.minPrice).toBe("");
    expect(result.current.maxPrice).toBe("");
    expect(result.current.sort).toBe("");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.localMinPrice).toBe("");
    expect(result.current.localMaxPrice).toBe("");
  });

  it("handleFilterChange should update URL search params correctly", () => {
    const getMock = jest.fn((key) => {
      if (key === "category") return "Food";
      return null;
    });
    const toStringMock = jest.fn(() => "category=Food");

    mockedUseSearchParams.mockReturnValue({ get: getMock, toString: toStringMock });

    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.handleFilterChange({
        category: "Electronics",
        minPrice: "10",
        maxPrice: "",
        sort: "price-asc",
      });
    });

    expect(pushMock).toHaveBeenCalled();
    const pushedUrl = pushMock.mock.calls[0][0];
    expect(pushedUrl).toContain("category=Electronics");
    expect(pushedUrl).toContain("minPrice=10");
    expect(pushedUrl).not.toContain("maxPrice");
    expect(pushedUrl).toContain("sort=price-asc");
  });

  it("handlePriceChange updates local min/max price correctly", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.handlePriceChange("min", "123abc.45.6");
      result.current.handlePriceChange("max", "78xyz.9");
    });

    expect(result.current.localMinPrice).toBe("123.456");
    expect(result.current.localMaxPrice).toBe("78.9");
  });

  it("applyPriceFilters pushes correct query params", () => {
    const getMock = jest.fn(() => "");
    const toStringMock = jest.fn(() => "");

    mockedUseSearchParams.mockReturnValue({ get: getMock, toString: toStringMock });

    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setLocalMinPrice("10");
      result.current.setLocalMaxPrice("100");
    });

    act(() => {
      result.current.handlePriceBlur();
    });

    expect(pushMock).toHaveBeenCalledWith("?minPrice=10&maxPrice=100");
  });

  it("resetFilters resets local states and pushes root url", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setLocalMinPrice("5");
      result.current.setLocalMaxPrice("50");
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.localMinPrice).toBe("");
    expect(result.current.localMaxPrice).toBe("");
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("filterProducts filters and sorts products correctly", () => {
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => {
        switch (key) {
          case "q":
            return "apple";
          case "category":
            return "Electronics";
          case "minPrice":
            return "900";
          case "maxPrice":
            return "1500";
          case "sort":
            return "price-desc";
          default:
            return "";
        }
      },
      toString: jest.fn(() => ""),
    });

    const { result } = renderHook(() => useProductFilters());

    const filtered = result.current.filterProducts(products);
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe("Apple iPhone");
  });

  it("getCategories returns unique categories", () => {
    const { result } = renderHook(() => useProductFilters());

    const categories = result.current.getCategories(products);

    expect(categories).toEqual(["Electronics", "Food"]);
  });

  it("handlePriceKeyDown applies price filters on Enter key", () => {
    const getMock = jest.fn(() => "");
    const toStringMock = jest.fn(() => "");

    mockedUseSearchParams.mockReturnValue({ get: getMock, toString: toStringMock });

    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setLocalMinPrice("15");
      result.current.setLocalMaxPrice("60");
    });

    const enterKeyEvent = {
      key: "Enter",
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as React.KeyboardEvent;

    act(() => {
      result.current.handlePriceKeyDown(enterKeyEvent);
    });

    expect(pushMock).toHaveBeenCalledWith("?minPrice=15&maxPrice=60");
  });

  it("filterProducts sorts by rating correctly", () => {
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "sort" ? "rating" : ""),
      toString: jest.fn(() => ""),
    });

    const { result } = renderHook(() => useProductFilters());
    const sorted = result.current.filterProducts(products);

    expect(sorted[0].rating.rate).toBeGreaterThanOrEqual(sorted[1].rating.rate);
    expect(sorted[1].rating.rate).toBeGreaterThanOrEqual(sorted[2].rating.rate);
  });

  it("filterProducts sorts by title asc", () => {
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "sort" ? "title-asc" : ""),
      toString: jest.fn(() => ""),
    });

    const { result } = renderHook(() => useProductFilters());
    const sorted = result.current.filterProducts(products);

    expect(sorted.map((p) => p.title)).toEqual(["Apple iPhone", "Banana", "Orange Juice"]);
  });

  it("filterProducts sorts by title desc", () => {
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "sort" ? "title-desc" : ""),
      toString: jest.fn(() => ""),
    });

    const { result } = renderHook(() => useProductFilters());
    const sorted = result.current.filterProducts(products);

    expect(sorted.map((p) => p.title)).toEqual(["Orange Juice", "Banana", "Apple iPhone"]);
  });

  it("filterProducts handles null input gracefully", () => {
    const { result } = renderHook(() => useProductFilters());
    // @ts-expect-error intentionally passing null to simulate edge case
    const filtered = result.current.filterProducts(null);
    expect(filtered).toEqual([]);
  });

  it("getCategories handles empty input gracefully", () => {
    const { result } = renderHook(() => useProductFilters());
    const categories = result.current.getCategories([]);
    expect(categories).toEqual([]);
  });
});
