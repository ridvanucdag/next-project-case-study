import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartPage from "./page";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

jest.mock("@/contexts/CartContext");
jest.mock("next/navigation");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("CartPage", () => {
  const mockUpdateQuantity = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockClearCart = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useCart as jest.Mock).mockReturnValue({
      cart: [],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("shows empty cart UI when cart is empty", () => {
    render(<CartPage />);
    expect(screen.getByText("cart.cartEmptyTitle")).toBeInTheDocument();
    expect(screen.getByText("cart.cartEmptyDesc")).toBeInTheDocument();
    fireEvent.click(screen.getByText("cart.discoverProducts"));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("renders cart items correctly", () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      cart: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          quantity: 2,
          image: "/image1.jpg",
        },
        {
          id: "2",
          name: "Product 2",
          price: 50,
          quantity: 1,
          image: "/image2.jpg",
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(<CartPage />);

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getAllByText("2")[0]).toBeInTheDocument();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("200.00 ₺").length).toBeGreaterThan(0);
    expect(screen.getAllByText("50.00 ₺").length).toBeGreaterThan(0);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls updateQuantity when quantity increase or decrease buttons clicked", () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      cart: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          quantity: 2,
          image: "/image1.jpg",
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(<CartPage />);

    const increaseBtn = screen.getByLabelText("cart.quantityIncrease");
    const decreaseBtn = screen.getByLabelText("cart.quantityDecrease");

    fireEvent.click(increaseBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("1", 3);

    fireEvent.click(decreaseBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("1", 1);
  });

  it("calls removeFromCart when remove button clicked", () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      cart: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          quantity: 1,
          image: "/image1.jpg",
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(<CartPage />);
    fireEvent.click(screen.getByLabelText("cart.remove"));
    expect(mockRemoveFromCart).toHaveBeenCalledWith("1");
  });

  it("calls clearCart when clear cart button clicked", () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      cart: [
        { id: "1", name: "Product 1", price: 100, quantity: 1, image: "/image1.jpg" },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(<CartPage />);

    fireEvent.click(screen.getByLabelText("cart.clearCart"));
    expect(mockClearCart).toHaveBeenCalled();
  });

  it("shows correct subtotal, shipping and total amounts", () => {
    (useCart as jest.Mock).mockReturnValueOnce({
      cart: [
        { id: "1", name: "Product 1", price: 400, quantity: 1, image: "/image1.jpg" },
        { id: "2", name: "Product 2", price: 200, quantity: 2, image: "/image2.jpg" },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });

    render(<CartPage />);

    expect(screen.getAllByText("800.00 ₺").length).toBeGreaterThan(0);

    expect(screen.getByText("cart.freeShipping")).toBeInTheDocument();

    expect(screen.getAllByText("800.00 ₺").length).toBeGreaterThan(0);
  });
});
