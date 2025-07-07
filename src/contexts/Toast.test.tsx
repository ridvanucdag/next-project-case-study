import React from "react";
import { renderHook, act } from "@testing-library/react";
import { ToastProvider, useToast } from "./ToastContext";

jest.useFakeTimers();

describe("ToastContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  test("showToast adds a toast and auto removes after 3s", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast("Test message", "success");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Test message");
    expect(result.current.toasts[0].type).toBe("success");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  test("removeToast removes toast by id", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast("Another message", "error");
    });

    const id = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  test("showToast defaults type to info", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast("Info message");
    });

    expect(result.current.toasts[0].type).toBe("info");
  });

  test("throws error if useToast used outside provider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow(
      "useToast must be used within a ToastProvider"
    );
    consoleError.mockRestore();
  });
});
