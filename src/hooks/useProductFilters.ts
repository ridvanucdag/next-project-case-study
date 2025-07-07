import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/requests/products/product.types";

export const useProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [localMinPrice, setLocalMinPrice] = useState("");
  const [localMaxPrice, setLocalMaxPrice] = useState("");
  
  const category = searchParams?.get("category") || "";
  const minPrice = searchParams?.get("minPrice") || "";
  const maxPrice = searchParams?.get("maxPrice") || "";
  const sort = searchParams?.get("sort") || "";
  const searchQuery = searchParams?.get("q") || "";

  const handleFilterChange = (newFilters: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (newFilters.category !== undefined) {
      if (newFilters.category) params.set("category", newFilters.category);
      else params.delete("category");
    }

    if (newFilters.minPrice !== undefined) {
      if (newFilters?.minPrice !== "") params.set("minPrice", newFilters?.minPrice);
      else params.delete("minPrice");
    }

    if (newFilters.maxPrice !== undefined) {
      if (newFilters?.maxPrice !== "") params.set("maxPrice", newFilters?.maxPrice);
      else params.delete("maxPrice");
    }

    if (newFilters.sort !== undefined) {
      if (newFilters?.sort) params.set("sort", newFilters?.sort);
      else params.delete("sort");
    }

    router?.push(`?${params?.toString()}`);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

    if (type === "min") {
      setLocalMinPrice(numericValue);
    } else {
      setLocalMaxPrice(numericValue);
    }
  };

  const applyPriceFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());

    if (localMinPrice) params.set("minPrice", localMinPrice);
    else params.delete("minPrice");

    if (localMaxPrice) params.set("maxPrice", localMaxPrice);
    else params.delete("maxPrice");

    router?.push(`?${params?.toString()}`);
  };

  const handlePriceBlur = () => applyPriceFilters();
  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") applyPriceFilters();
  };

  const resetFilters = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    router?.push("/");
  };

  const filterProducts = (products: Product[]) => {
    if (!products) return [];

    let result = [...products];

    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      result = result?.filter((product) =>
        product?.title?.toLowerCase()?.includes(query)
      );
    }

    if (category) {
      result = result?.filter((product) =>
        product?.category?.toLowerCase()?.includes(category?.toLowerCase())
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      result = result?.filter((product) => product?.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      result = result?.filter((product) => product?.price <= max);
    }

    if (sort === "price-asc") {
      result?.sort((a, b) => a?.price - b?.price);
    } else if (sort === "price-desc") {
      result?.sort((a, b) => b?.price - a?.price);
    } else if (sort === "rating") {
      result?.sort((a, b) => b?.rating?.rate - a?.rating?.rate);
    } else if (sort === "title-asc") {
      result?.sort((a, b) => a?.title?.localeCompare(b?.title));
    } else if (sort === "title-desc") {
      result?.sort((a, b) => b?.title?.localeCompare(a?.title));
    }

    return result;
  };

  const getCategories = (products: Product[]) => {
    return [...new Set(products?.map((product) => product?.category) || [])];
  };

  return {
    category,
    minPrice,
    maxPrice,
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
    setLocalMinPrice,
    setLocalMaxPrice,
  };
};