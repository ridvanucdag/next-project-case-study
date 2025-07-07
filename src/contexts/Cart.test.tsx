import React from "react";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, CartItem } from "./CartContext";

describe("CartContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  beforeEach(() => {
    localStorage.clear();
  });

  test("adds new item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const product: CartItem = {
      id: 1,
      name: "Test Product",
      price: 10,
      quantity: 1,
      image: "image.jpg",
    };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toEqual(product);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(10);
  });

  test("increments quantity if product already exists", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const product: CartItem = {
      id: 1,
      name: "Test Product",
      price: 10,
      quantity: 2,
      image: "image.jpg",
    };

    act(() => {
      result.current.addToCart(product);
    });
    act(() => {
      result.current.addToCart({ ...product, quantity: 3 });
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(5);
  });

  test("removes item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product: CartItem = {
      id: 1,
      name: "Test Product",
      price: 10,
      quantity: 1,
      image: "image.jpg",
    };

    act(() => {
      result.current.addToCart(product);
    });
    act(() => {
      result.current.removeFromCart(product.id);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test("updates quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product: CartItem = {
      id: 1,
      name: "Test Product",
      price: 10,
      quantity: 1,
      image: "image.jpg",
    };

    act(() => {
      result.current.addToCart(product);
    });
    act(() => {
      result.current.updateQuantity(product.id, 4);
    });

    expect(result.current.cart[0].quantity).toBe(4);
  });

  test("removes item if quantity set to 0 or less", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product: CartItem = {
      id: 1,
      name: "Test Product",
      price: 10,
      quantity: 1,
      image: "image.jpg",
    };

    act(() => {
      result.current.addToCart(product);
    });
    act(() => {
      result.current.updateQuantity(product.id, 0);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test("clears cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product1: CartItem = { id: 1, name: "P1", price: 10, quantity: 1, image: "" };
    const product2: CartItem = { id: 2, name: "P2", price: 20, quantity: 1, image: "" };

    act(() => {
      result.current.addToCart(product1);
      result.current.addToCart(product2);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test("persists cart to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product: CartItem = {
      id: 1,
      name: "Persisted Product",
      price: 15,
      quantity: 1,
      image: "image.jpg",
    };

    act(() => {
      result.current.addToCart(product);
    });

    const stored = localStorage.getItem("cart");
    expect(stored).toBe(JSON.stringify(result.current.cart));
  });

  test("loads cart from localStorage on init", () => {
    const savedCart = [
      { id: 10, name: "Saved Product", price: 5, quantity: 2, image: "img.jpg" },
    ];
    localStorage.setItem("cart", JSON.stringify(savedCart));

    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual(savedCart);
  });
});
