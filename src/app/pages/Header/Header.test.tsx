import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./page";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockToggleTheme = jest.fn();

jest.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: mockToggleTheme,
  }),
}));

jest.mock("@/contexts/CartContext", () => ({
  useCart: () => ({
    cart: [
      { id: "1", quantity: 2 },
      { id: "2", quantity: 3 },
    ],
  }),
}));

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (term: string) => void;
}

jest.mock("@/components/SearchBar/SearchBar", () => {
  const MockSearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    onSearch,
  }) => (
    <input
      data-testid="search-bar"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch(searchTerm);
        }
      }}
    />
  );
  MockSearchBar.displayName = "MockSearchBar";
  return MockSearchBar;
});

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the title and links", () => {
    render(<Header />);
    expect(screen.getByText("SeturCase")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /SeturCase/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  test("renders total items in cart correctly", () => {
    render(<Header />);
    const badge = screen.getAllByText("5");
    expect(badge.length).toBeGreaterThan(0);
  });

  test("toggleTheme is called when theme toggle button clicked", () => {
    render(<Header />);
    const button = screen.getByRole("button", {
      name: /Switch to dark mode/i,
    });
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  test("search bar receives props and triggers onSearch on Enter", () => {
    render(<Header />);
    const input = screen.getByTestId("search-bar");
    fireEvent.change(input, { target: { value: "test query" } });
    expect(input).toHaveValue("test query");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/?q=test%20query");
  });

  test("toggleSearch toggles search visibility", () => {
    render(<Header />);
    const searchIcon = screen.getAllByRole("button").find((btn) =>
      btn.className.includes("searchHeaderIcon")
    );
    if (searchIcon) {
      fireEvent.click(searchIcon);
      const input = screen.getByTestId("search-bar");
      expect(input).toBeInTheDocument();
    }
  });
});
