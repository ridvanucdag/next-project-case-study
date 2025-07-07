import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("@/app/pages/products/page", () => {
  const ProductsPage = () => <div data-testid="products-page">Mocked Products Page</div>;
  return ProductsPage;
});

describe("Home Page", () => {
  it("renders the ProductsPage component", () => {
    render(<Home />);
    expect(screen.getByTestId("products-page")).toBeInTheDocument();
  });
});
