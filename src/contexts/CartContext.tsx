"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";


export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem("cart");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const totalItems = cart?.reduce((sum, item) => sum + item?.quantity, 0);
  const totalPrice = cart?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart?.find((item) => item?.id === product?.id);
      if (existing) {
        return prevCart?.map((item) =>
          item?.id === product?.id 
            ? { ...item, quantity: item?.quantity + product?.quantity } 
            : item
        );
      }
      return [...prevCart, product];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart?.filter(item => item?.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart?.map(item =>
        item?.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};