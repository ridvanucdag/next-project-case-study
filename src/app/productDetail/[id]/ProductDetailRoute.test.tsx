import React from "react";
import { render, screen } from "@testing-library/react";
import ProductDetailRoute from "./page";
import * as ProductDetailPageModule from "@/app/pages/ProductDetailPage/ProductDetailPage";

jest.spyOn(ProductDetailPageModule, "default").mockImplementation(({ productId }: { productId: number }) => (
  <div data-testid="mock-product-detail">{`productId: ${productId}`}</div>
));

describe("ProductDetailRoute", () => {
  it("should pass productId to ProductDetailPage", async () => {
    const paramsPromise = Promise.resolve({ id: "123" });

    const AsyncComponentWrapper = () => {
      const [jsx, setJsx] = React.useState<React.ReactNode>(null);

      React.useEffect(() => {
        ProductDetailRoute({ params: paramsPromise }).then(setJsx);
      }, []);

      return <>{jsx}</>;
    };

    render(<AsyncComponentWrapper />);

    const rendered = await screen.findByTestId("mock-product-detail");

    expect(rendered.textContent).toBe("productId: 123");
  });
});
