import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

jest.mock("@/requests/base/NextContextProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="next-context">{children}</div>
  ),
}));

jest.mock("@/contexts/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock("@/contexts/CartContext", () => ({
  CartProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="cart-provider">{children}</div>
  ),
}));

jest.mock("@/contexts/ToastContext", () => ({
  ToastProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="toast-provider">{children}</div>
  ),
}));

jest.mock("@/components/Toast/Toast", () => {
  const Toast = () => <div data-testid="toast-component">Toast</div>;
  return Toast;
});

jest.mock("@/app/pages/Header/page", () => {
  const Header = () => <div data-testid="header-component">Header</div>;
  return Header;
});

describe("RootLayout", () => {
  it("renders layout with providers and children", () => {
    render(
      <RootLayout>
        <div data-testid="page-content">Page Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("next-context")).toBeInTheDocument();
    expect(screen.getByTestId("toast-provider")).toBeInTheDocument();
    expect(screen.getByTestId("cart-provider")).toBeInTheDocument();
    expect(screen.getByTestId("header-component")).toBeInTheDocument();
    expect(screen.getByTestId("toast-component")).toBeInTheDocument();
    expect(screen.getByTestId("page-content")).toBeInTheDocument();
  });
});
