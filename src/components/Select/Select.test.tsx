import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Select from "./Select";

describe("Select Component", () => {
  const options = [
    { value: "val1", label: "Label 1" },
    { value: "val2", label: "Label 2" },
  ];

  test("renders label when provided", () => {
    render(<Select id="test-select" label="Test Label" options={options} />);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-select");
  });

  test("renders options from props", () => {
    render(<Select id="test-select" options={options} />);
    options.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test("renders children when no options prop provided", () => {
    render(
      <Select id="test-select">
        <option value="child1">Child Option 1</option>
        <option value="child2">Child Option 2</option>
      </Select>
    );
    expect(screen.getByText("Child Option 1")).toBeInTheDocument();
    expect(screen.getByText("Child Option 2")).toBeInTheDocument();
  });

  test("shows error message and applies error class when error prop provided", () => {
    render(<Select id="test-select" options={options} error="Error occurred" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("error");
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("calls onChange handler when selection changes", () => {
    const handleChange = jest.fn();
    render(
      <Select id="test-select" options={options} onChange={handleChange} />
    );
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "val2" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
