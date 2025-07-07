import React, { JSX } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductDetailPage from "./ProductDetailPage";

import { useSingleProductQuery } from "@/requests/products/product.query";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: JSX.IntrinsicElements["img"]) => <img {...props} />,
}));

jest.mock("@/requests/products/product.query");
jest.mock("@/contexts/CartContext");
jest.mock("@/contexts/ToastContext");
jest.mock("next/navigation");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ProductDetailPage", () => {
  const mockUseSingleProductQuery = useSingleProductQuery as jest.Mock;
  const mockUseCart = useCart as jest.Mock;
  const mockUseToast = useToast as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  const product = {
    id: 1,
    title: "Test Product",
    price: 99.99,
    description: "Test description",
    category: "Test category",
    image: "/test.jpg",
    rating: { rate: 4, count: 10 },
  };

  const addToCartMock = jest.fn();
  const showToastMock = jest.fn();
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSingleProductQuery.mockReturnValue({
      data: product,
      isLoading: false,
      error: null,
    });

    mockUseCart.mockReturnValue({
      cart: [],
      addToCart: addToCartMock,
    });

    mockUseToast.mockReturnValue({
      showToast: showToastMock,
    });

    mockUseRouter.mockReturnValue({
      push: pushMock,
    });
  });

  it("renders loading state", () => {
    mockUseSingleProductQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<ProductDetailPage productId={1} />);

    expect(screen.getByText("product.loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseSingleProductQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed"),
    });

    render(<ProductDetailPage productId={1} />);

    expect(screen.getByText("product.notFound")).toBeInTheDocument();
  });

  it("renders product info when data is loaded", () => {
    render(<ProductDetailPage productId={1} />);

    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(product.price.toFixed(2) + " ₺")).toBeInTheDocument();
    expect(screen.getByText("product.description.title")).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  it("adds product to cart and shows success toast if not in cart", () => {
    render(<ProductDetailPage productId={1} />);

    fireEvent.click(screen.getByText("product.addToCart"));

    expect(addToCartMock).toHaveBeenCalledWith({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    expect(showToastMock).toHaveBeenCalledWith("product.toast.added", "success");
  });

  it("shows error toast if product is already in cart", () => {
    mockUseCart.mockReturnValueOnce({
      cart: [{ id: product.id }],
      addToCart: addToCartMock,
    });

    render(<ProductDetailPage productId={1} />);

    fireEvent.click(screen.getByText("product.addToCart"));

    expect(addToCartMock).not.toHaveBeenCalled();
    expect(showToastMock).toHaveBeenCalledWith("product.toast.alreadyInCart", "error");
  });

  it("buy now button adds to cart and redirects to /cart", () => {
    render(<ProductDetailPage productId={1} />);

    fireEvent.click(screen.getByText("product.buyNow"));

    expect(addToCartMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/cart");
  });
});
