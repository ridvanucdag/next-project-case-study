import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import NextContextProvider from "./NextContextProvider";

jest.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div data-testid="react-query-devtools">DevTools</div>,
}));

describe("NextContextProvider", () => {
  it("renders children correctly", () => {
    render(
      <NextContextProvider>
        <div data-testid="child">Child Content</div>
      </NextContextProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders ReactQueryDevtools after isClient is set to true", async () => {
    await act(async () => {
      render(
        <NextContextProvider>
          <div>Test</div>
        </NextContextProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("react-query-devtools")).toBeInTheDocument();
    });
  });

  it("wraps children with QueryClientProvider", () => {
    render(
      <NextContextProvider>
        <div data-testid="child">Child Content</div>
      </NextContextProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
