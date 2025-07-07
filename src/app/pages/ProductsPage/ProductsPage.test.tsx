import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductsPage from "./ProductsPage";
import { usePaginatedProductsQuery } from "@/requests/products/product.query";
import { useProductFilters } from "@/hooks/useProductFilters";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";

jest.mock("@/requests/products/product.query");
jest.mock("@/hooks/useProductFilters");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) =>
      options?.count !== undefined
        ? `${key.replace(/\./g, " ")}: ${options.count}`
        : key,
  }),
}));

const mockProducts = Array.from({ length: 15 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Product ${i + 1}`,
  price: (i + 1) * 10,
  rating: { rate: 4.5 },
  image: `/image${i + 1}.jpg`,
}));

describe("ProductsPage", () => {
  const mockFilterFunctions = {
    category: "",
    sort: "",
    searchQuery: "",
    localMinPrice: "",
    localMaxPrice: "",
    handleFilterChange: jest.fn(),
    handlePriceChange: jest.fn(),
    handlePriceBlur: jest.fn(),
    handlePriceKeyDown: jest.fn(),
    resetFilters: jest.fn(),
    filterProducts: jest.fn(),
    getCategories: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (usePaginatedProductsQuery as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    mockFilterFunctions.filterProducts.mockImplementation((products) => products);

    mockFilterFunctions.getCategories.mockReturnValue([
      "Category 1",
      "Category 2",
      "Category 3",
    ]);

    (useProductFilters as jest.Mock).mockReturnValue(mockFilterFunctions);
  });

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ToastProvider>
      <CartProvider>
        {ui}
      </CartProvider>
    </ToastProvider>
  );
};

  it("renders loading skeletons when loading", () => {
    (usePaginatedProductsQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<ProductsPage />);
    const skeletons = screen.getAllByText((content, element) => {
      if (!element) return false;
      return element.classList.contains("skeletonCard");
    });
    expect(skeletons.length).toBe(10);
  });

  it("renders error message if error occurs", () => {
    (usePaginatedProductsQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: true,
    });

    renderWithProviders(<ProductsPage />);
    expect(screen.getByText("products.errorOccurred")).toBeInTheDocument();
  });

  it("renders products with pagination and filters", () => {
    renderWithProviders(<ProductsPage />);

    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Product ${i}`)).toBeInTheDocument();
    }

    expect(screen.queryByText("Product 11")).not.toBeInTheDocument();

    expect(screen.getByLabelText("products.category")).toBeInTheDocument();
    expect(screen.getByText("Category 1")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("products.minPrice")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("products.maxPrice")).toBeInTheDocument();
    expect(screen.getByText("products.resetFilters")).toBeInTheDocument();

    expect(screen.getByText("1")).toHaveClass("activePage");

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("products.previous")).toBeDisabled();
    expect(screen.getByText("products.next")).not.toBeDisabled();
  });

  it("navigates pages when pagination buttons clicked", () => {
    renderWithProviders(<ProductsPage />);

    const nextBtn = screen.getByText("products.next");
    fireEvent.click(nextBtn);

    return waitFor(() => {
      expect(screen.getByText("Product 11")).toBeInTheDocument();
    });
  });

  it("calls filter handlers when filters change", () => {
    renderWithProviders(<ProductsPage />);

    const categorySelect = screen.getByLabelText("products.category");
    fireEvent.change(categorySelect, { target: { value: "Category 2" } });
    expect(mockFilterFunctions.handleFilterChange).toHaveBeenCalledWith({
      category: "Category 2",
    });

    const sortSelect = screen.getByLabelText("products.sort");
    fireEvent.change(sortSelect, { target: { value: "price-asc" } });
    expect(mockFilterFunctions.handleFilterChange).toHaveBeenCalledWith({
      sort: "price-asc",
    });

    const minPriceInput = screen.getByPlaceholderText("products.minPrice");
    fireEvent.change(minPriceInput, { target: { value: "10" } });
    expect(mockFilterFunctions.handlePriceChange).toHaveBeenCalledWith("min", "10");

    const maxPriceInput = screen.getByPlaceholderText("products.maxPrice");
    fireEvent.change(maxPriceInput, { target: { value: "100" } });
    expect(mockFilterFunctions.handlePriceChange).toHaveBeenCalledWith("max", "100");

    const resetButton = screen.getByText("products.resetFilters");
    fireEvent.click(resetButton);
    expect(mockFilterFunctions.resetFilters).toHaveBeenCalled();
  });

  it("shows no results message when filtered products empty", () => {
    mockFilterFunctions.filterProducts.mockReturnValue([]);

    renderWithProviders(<ProductsPage />);

    expect(screen.getByText("products.noResults")).toBeInTheDocument();
  });
});
