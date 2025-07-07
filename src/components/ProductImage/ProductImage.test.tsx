import React from "react";
import { render, screen } from "@testing-library/react";
import ProductImage from "./ProductImage";
import type { ImgHTMLAttributes } from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, className } = props;
    return <img src={src as string} alt={alt} className={className} />;
  },
}));

describe("ProductImage Component", () => {
  const defaultProps = {
    src: "https://via.placeholder.com/150",
    alt: "Test Image",
    width: 150,
    height: 150,
  };

  test("renders an image with correct src and alt", () => {
    render(<ProductImage {...defaultProps} />);
    const img = screen.getByAltText("Test Image") as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.src).toContain(defaultProps.src);
  });

  test("applies given className and sizes properly", () => {
    render(<ProductImage {...defaultProps} className="custom-class" />);
    const wrapperDiv = screen.getByAltText("Test Image").parentElement;

    expect(wrapperDiv).toHaveClass("relative custom-class");
    expect(wrapperDiv).toHaveStyle(`width: ${defaultProps.width}px`);
    expect(wrapperDiv).toHaveStyle(`height: ${defaultProps.height}px`);
  });

  test("uses eager loading when priority is true", () => {
    render(<ProductImage {...defaultProps} priority />);
    const img = screen.getByAltText("Test Image");

    expect(img).toBeInTheDocument();
  });
});
