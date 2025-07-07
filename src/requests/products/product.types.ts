import { UseQueryResult } from "@tanstack/react-query";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface PaginatedProductsQueryParams {
  limit: number;
  offset: number;
}

export type GetProductsReturn = UseQueryResult<Product[]>;

