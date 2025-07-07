export const productKeyFactory = {
  getProduct: (): string[] => ["PRODUCT_GET_PRODUCT_KEY"],
  getProductById: (id: number): string[] => [`PRODUCT_GET_PRODUCT_KEY_${id}`],
  getProductPaginated: (limit: number, offset: number) =>
    ['products', 'paginated', limit, offset] as const,
};
