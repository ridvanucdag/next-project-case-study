import React from "react";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

describe("ThemeContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  test("initializes theme from localStorage", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.className).toBe("dark");
  });

  test("initializes theme from prefers-color-scheme if no localStorage", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(["dark", "light"]).toContain(result.current.theme);
    expect(document.documentElement.className).toBe(result.current.theme);
  });

  test("toggleTheme switches theme and persists it", () => {
    localStorage.setItem("theme", "light");

    const { result } = renderHook(() => useTheme(), { wrapper });

    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    const toggledTheme = result.current.theme;
    const expectedTheme = initialTheme === "dark" ? "light" : "dark";

    expect(toggledTheme).toBe(expectedTheme);
    expect(localStorage.getItem("theme")).toBe(expectedTheme);
    expect(document.documentElement.className).toBe(expectedTheme);
  });

  test("throws error if useTheme is used outside of ThemeProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within ThemeProvider"
    );

    consoleError.mockRestore();
  });
});
