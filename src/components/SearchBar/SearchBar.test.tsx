import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";
import { SearchBarProps } from "./Searbar.type";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => (key === "search.placeholder" ? "Arama Yap" : key),
  }),
}));

const styles = {
  searchHeaderIcons: "searchHeaderIcons",
  searchIconHidden: "searchIconHidden",
  clearSearchIcon: "clearSearchIcon",
};

describe("SearchBar Component", () => {
  const defaultProps: SearchBarProps = {
    searchTerm: "",
    setSearchTerm: jest.fn(),
    isSearchVisible: false,
    setIsSearchVisible: jest.fn(),
    onSearch: jest.fn(),
    onToggleSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getVisibleSearchInput = () => {
    const inputs = screen.getAllByPlaceholderText("Arama Yap");

    const found = inputs.find((input) =>
      input.classList.contains("searchInputHeader")
    );

    return found ?? inputs[0];
  };

  test("renders hidden search input when isSearchVisible is false", () => {
    render(<SearchBar {...defaultProps} />);
    const inputs = screen.getAllByPlaceholderText("Arama Yap");
    expect(inputs.length).toBeGreaterThan(0);
  });

  test("renders search input header container when isSearchVisible is true", () => {
    render(<SearchBar {...defaultProps} isSearchVisible={true} />);
    const input = getVisibleSearchInput();
    expect(input).toBeInTheDocument();
  });

  test("calls setSearchTerm on input change", () => {
    const setSearchTermMock = jest.fn();
    render(
      <SearchBar
        {...defaultProps}
        setSearchTerm={setSearchTermMock}
        isSearchVisible={true}
      />
    );
    const input = getVisibleSearchInput();
    fireEvent.change(input, { target: { value: "test search" } });
    expect(setSearchTermMock).toHaveBeenCalledWith("test search");
  });

  test("calls onSearch with searchTerm when Enter is pressed", () => {
    const onSearchMock = jest.fn();
    const searchTerm = "hello";
    render(
      <SearchBar
        {...defaultProps}
        onSearch={onSearchMock}
        searchTerm={searchTerm}
        isSearchVisible={true}
      />
    );
    const input = getVisibleSearchInput();
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(onSearchMock).toHaveBeenCalledWith(searchTerm);
  });

  test("calls onSearch when search icon clicked", () => {
    const onSearchMock = jest.fn();
    render(
      <SearchBar {...defaultProps} onSearch={onSearchMock} isSearchVisible={true} />
    );

    const searchIcon = document.querySelector(`.${styles.searchHeaderIcons}`);

    if (!searchIcon) throw new Error("Search icon not found");

    fireEvent.click(searchIcon);
    expect(onSearchMock).toHaveBeenCalled();
  });

  test("calls clearSearch which resets searchTerm and hides search when clear icon clicked", () => {
    const setSearchTermMock = jest.fn();
    const setIsSearchVisibleMock = jest.fn();

    render(
      <SearchBar
        {...defaultProps}
        searchTerm="some text"
        setSearchTerm={setSearchTermMock}
        setIsSearchVisible={setIsSearchVisibleMock}
        isSearchVisible={true}
      />
    );

    const clearIcon = document.querySelector(`.${styles.clearSearchIcon}`);
    if (!clearIcon) throw new Error("Clear icon not found");

    fireEvent.click(clearIcon);

    expect(setSearchTermMock).toHaveBeenCalledWith("");
    expect(setIsSearchVisibleMock).toHaveBeenCalledWith(false);
  });

  test("calls onToggleSearch when search icon in hidden container is clicked", () => {
    const onToggleSearchMock = jest.fn();
    render(
      <SearchBar
        {...defaultProps}
        isSearchVisible={false}
        onToggleSearch={onToggleSearchMock}
      />
    );

    const hiddenSearchIcon = document.querySelector(`.${styles.searchIconHidden}`);
    if (!hiddenSearchIcon) throw new Error("Hidden search icon not found");

    fireEvent.click(hiddenSearchIcon);
    expect(onToggleSearchMock).toHaveBeenCalled();
  });
});
