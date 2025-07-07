import React from "react";
import { render, screen } from "@testing-library/react";
import ProductsPage from "../ProductsPage/ProductsPage";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import type { ImageProps, StaticImageData } from "next/image";
import { Product } from "@/requests/products/product.types";

type NextImageProps = Omit<ImageProps, "src"> & {
  src: string | StaticImageData;
};

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: NextImageProps) => {
    const { src, alt, width, height, className, style, ...rest } = props;
    const imgSrc =
      typeof src === "string"
        ? src
        : (src as StaticImageData).src;

    return (
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        {...rest}
      />
    );
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

interface Page {
  products: Product[];
}

interface Data {
  pages: Page[];
}

jest.mock("@/requests/products/product.query", () => ({
  usePaginatedProductsQuery: () => ({
    data: {
      pages: [
        {
          products: [
            {
              id: 1,
              title: "Product 1",
              price: 100,
              description: "Sample description",
              category: "Sample Category",
              image: "/sample-image.jpg",
              rating: {
                rate: 4.5,
                count: 10,
              },
            },
          ],
        },
      ],
    },
    isLoading: false,
    error: null,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
  }),
}));

jest.mock("@/hooks/useProductFilters", () => ({
  useProductFilters: () => ({
    filterProducts: (data: Data | undefined) => {
      if (data && Array.isArray(data.pages)) {
        return data.pages.flatMap((page: Page) => page.products);
      }
      return [];
    },
    query: {},
    onFilterChange: jest.fn(),
    filterOptions: [],
    searchQuery: "",
    onSearchChange: jest.fn(),
    getCategories: jest.fn(() => ["mockCategory"]),
    category: "",
    sort: "",
    localMinPrice: "",
    localMaxPrice: "",
    handleFilterChange: jest.fn(),
    handlePriceChange: jest.fn(),
    handlePriceBlur: jest.fn(),
    handlePriceKeyDown: jest.fn(),
    resetFilters: jest.fn(),
  }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ToastProvider>
      <CartProvider>{ui}</CartProvider>
    </ToastProvider>
  );
};

describe("ProductsPage", () => {
  it("renders product title", () => {
    renderWithProviders(<ProductsPage />);
    expect(screen.getByText("Product 1")).toBeInTheDocument();
  });
});
