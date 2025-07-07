import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCart';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import '@testing-library/jest-dom';
import { ProductCardProps } from './ProductCart.type';

jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: jest.fn(),
}));

const mockAddToCart = jest.fn();
const mockRemoveFromCart = jest.fn();
const mockShowToast = jest.fn();

const baseProps: ProductCardProps = {
  id: 1,
  image: 'https://via.placeholder.com/150',
  title: 'Test Product',
  rating: 4.5,
  price: 99.99,
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product details correctly', () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: [],
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
    });
    (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });

    render(<ProductCard {...baseProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
    expect(screen.getByText(/99.99 ₺/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sepete ekle/i })).toBeInTheDocument();
  });

  test('adds product to cart when not in cart', () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: [],
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
    });
    (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });

    render(<ProductCard {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /sepete ekle/i }));

    expect(mockAddToCart).toHaveBeenCalledWith({
      id: baseProps.id,
      name: baseProps.title,
      price: baseProps.price,
      image: baseProps.image,
      quantity: 1,
    });

    expect(mockShowToast).toHaveBeenCalledWith('Ürün başarılı bir şekilde eklendi!', 'success');
  });

  test('removes product from cart when in cart', () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: [{ id: 1, name: 'Test Product', quantity: 1, price: 99.99, image: '' }],
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
    });
    (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });

    render(<ProductCard {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /sepetten çıkar/i }));

    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
    expect(mockShowToast).toHaveBeenCalledWith('Ürün başarılı bir şekilde kaldırıldı!', 'info');
  });

  test('product image links to detail page', () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: [],
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
    });
    (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });

    render(<ProductCard {...baseProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/productDetail/1');
  });
});
