"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCart/ProductCart";
import { usePaginatedProductsQuery } from "@/requests/products/product.query";
import { useProductFilters } from "@/hooks/useProductFilters";
import styles from "./products.module.css";
import Button from "@/components/Button/Button";
import { useTranslation } from "react-i18next";
import Select from "@/components/Select/Select";
import Input from "@/components/Input/Input";

const ProductsPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const {
    data: allProducts,
    isLoading,
    error,
  } = usePaginatedProductsQuery({
    limit: 100,
    offset: 0,
  });

  const {
    category,
    sort,
    searchQuery,
    localMinPrice,
    localMaxPrice,
    handleFilterChange,
    handlePriceChange,
    handlePriceBlur,
    handlePriceKeyDown,
    resetFilters,
    filterProducts,
    getCategories,
  } = useProductFilters();

  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts || []);
  }, [allProducts, filterProducts]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts?.slice(offset, offset + limit);
  }, [filteredProducts, offset, limit]);

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const categories = useMemo(
    () => getCategories(allProducts || []),
    [allProducts, getCategories]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (error)
    return <div className={styles.error}>{t("products.errorOccurred")}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("products.title")}</h1>

        {!isLoading && (
          <div className={styles.headerControls}>
            <div className={styles.resultsCount}>
              {searchQuery && (
                <span>
                   {t("products.searchQuery")}: {searchQuery} - {" "}
                </span>
              )}
              {t("products.resultsFound", { count: filteredProducts.length })}
            </div>

            <div className={styles.sortContainer}>
              <label htmlFor="sort">{t("products.sort")}</label>
              <Select
                id="sort"
                value={sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
              >
                <option value="">{t("products.sortOptions.default")}</option>
                <option value="price-asc">
                  {t("products.sortOptions.priceAsc")}
                </option>
                <option value="price-desc">
                  {t("products.sortOptions.priceDesc")}
                </option>
                <option value="rating">
                  {t("products.sortOptions.rating")}
                </option>
                <option value="title-asc">
                  {t("products.sortOptions.titleAsc")}
                </option>
                <option value="title-desc">
                  {t("products.sortOptions.titleDesc")}
                </option>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>{t("products.filters")}</h3>
            <div className={styles.filterGroup}>
              <label htmlFor="category">{t("products.category")}</label>
              <Select
                id="category"
                value={category}
                onChange={(e) =>
                  handleFilterChange({ category: e.target.value })
                }
              >
                <option value="">{t("products.allCategories")}</option>
                {categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.filterGroup}>
              <label>{t("products.priceRange")}</label>
              <div className={styles.priceRange}>
                <Input
                  id="minPrice"
                  type="text"
                  value={localMinPrice}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  onBlur={handlePriceBlur}
                  onKeyDown={handlePriceKeyDown}
                  className={styles.filterInput}
                  placeholder={t("products.minPrice")}
                  inputMode="decimal"
                />
                <span className={styles.priceSeparator}>-</span>
                <Input
                  id="maxPrice"
                  type="text"
                  value={localMaxPrice}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  onBlur={handlePriceBlur}
                  onKeyDown={handlePriceKeyDown}
                  className={styles.filterInput}
                  placeholder={t("products.maxPrice")}
                  inputMode="decimal"
                />
              </div>
            </div>

            <Button onClick={resetFilters} variant="light" fullWidth>
              {t("products.resetFilters")}
            </Button>
          </div>
        </aside>

        {!isLoading && filteredProducts.length === 0 && (
          <div className={styles.noResultsSidebar}>
            <p>{t("products.noResults")}</p>
          </div>
        )}

        <main className={styles.productGrid}>
          {isLoading
            ? Array.from({ length: 10 })?.map((_, index) => (
                <div key={index} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonRating}></div>
                  <div className={styles.skeletonPrice}></div>
                  <div className={styles.skeletonButton}></div>
                </div>
              ))
            : paginatedProducts?.map((product) => (
                <div key={product.id} className={styles.gridItem}>
                  <ProductCard
                    id={product?.id}
                    image={product?.image}
                    title={product?.title}
                    rating={product?.rating?.rate}
                    price={product?.price}
                  />
                </div>
              )) ?? []}
        </main>
      </div>

      {!isLoading && filteredProducts.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={styles.paginationButton}
          >
            {t("products.previous")}
          </button>

          {[...Array(totalPages)]?.map((_, index) => {
            const pageNum = index + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 2 && pageNum <= page + 2)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`${styles.paginationButton} ${
                    pageNum === page ? styles.activePage : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            }

            if (pageNum === 2 && page > 4) {
              return (
                <span key="ellipsis-start" className={styles.ellipsis}>
                  ...
                </span>
              );
            }

            if (pageNum === totalPages - 1 && page < totalPages - 3) {
              return (
                <span key="ellipsis-end" className={styles.ellipsis}>
                  ...
                </span>
              );
            }

            return null;
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={styles.paginationButton}
          >
            {t("products.next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
