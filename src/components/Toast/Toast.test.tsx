import React from "react";
import { render, screen } from "@testing-library/react";
import Toast from "./Toast";

const mockToasts = [
  { id: "1", message: "Success message", type: "success" },
  { id: "2", message: "Error message", type: "error" },
  { id: "3", message: "Info message", type: "info" },
];

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    toasts: mockToasts,
  }),
}));

describe("Toast Component", () => {
  test("renders all toasts from context", () => {
    render(<Toast />);
    mockToasts.forEach(({ message }) => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  test("applies correct type classes for each toast", () => {
    render(<Toast />);
    mockToasts.forEach(({ message, type }) => {
      const toastElement = screen.getByText(message);
      expect(toastElement).toHaveClass(type);
    });
  });

  test("renders toasts inside the toastContainer", () => {
    const { container } = render(<Toast />);
    const containerElement = container.querySelector("div");
    expect(containerElement).toHaveClass("toastContainer");
  });
});
