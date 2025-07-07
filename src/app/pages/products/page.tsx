// /pages/products/page.tsx
import React, { Suspense } from "react";
import ProductsPage from "../ProductsPage/ProductsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPage />
    </Suspense>
  );
}
