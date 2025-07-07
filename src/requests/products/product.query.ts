import { UseQueryResult } from "@tanstack/react-query";
import { ApiEndpoints, HttpMethod } from "../../api/createHttpClient.types";
import { useApiQuery } from "../base/useFetchers";
import {
  GetProductsReturn,
  PaginatedProductsQueryParams,
  Product,
} from "./product.types";
import { productKeyFactory } from "./productKeyFactory";

export const useProductQuery = (): GetProductsReturn => {
  const query = useApiQuery<Product[]>({
    queryKey: productKeyFactory.getProduct(),
    method: HttpMethod.GET,
    path: `${ApiEndpoints.PRODUCTS}`,
  });
  return query;
};

export const useSingleProductQuery = (id: number): UseQueryResult<Product> => {
  const query = useApiQuery<Product>({
    queryKey: productKeyFactory.getProductById(id),
    method: HttpMethod.GET,
    path: `${ApiEndpoints.PRODUCTS}/${id}`,
  });
  return query;
};

export const usePaginatedProductsQuery = ({
  limit,
  offset,
}: PaginatedProductsQueryParams): UseQueryResult<Product[]> => {
  const query = useApiQuery<Product[]>({
    queryKey: productKeyFactory.getProductPaginated(limit, offset),
    method: HttpMethod.GET,
    path: `${ApiEndpoints.PRODUCTS}?limit=${limit}&offset=${offset}`,
  });
  return query;
};
