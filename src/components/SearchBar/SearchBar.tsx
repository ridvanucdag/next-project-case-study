"use client";

import React, { useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import styles from "./searchbar.module.css";
import { SearchBarProps } from "./Searbar.type";

import { useTranslation } from 'react-i18next';

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  isSearchVisible,
  setIsSearchVisible,
  onSearch,
  onToggleSearch,
}) => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setIsSearchVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSearchVisible]);

  useEffect(() => {
    if (isSearchVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchVisible]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchVisible(false);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div>
      <div className={styles.searchHeaderContainer}>
        {isSearchVisible && (
          <div ref={searchRef} className={styles.searchInputHeaderContainer}>
            <AiOutlineSearch
              className={styles.searchHeaderIcons}
              onClick={handleSearch}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder={t("search.placeholder")}
              className={styles.searchInputHeader}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <AiOutlineClose
              className={styles.clearSearchIcon}
              onClick={clearSearch}
            />
          </div>
        )}
      </div>

      <div ref={iconRef} className={styles.searchContainerHidden}>
        <div className={styles.searchInputContainerHidden}>
          <AiOutlineSearch
            className={styles.searchIconHidden}
            onClick={onToggleSearch || (() => setIsSearchVisible(true))}
          />
          <input
            type="text"
            placeholder={t("search.placeholder")}
            className={styles.searchInputHidden}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchTerm.length > 0 && (
            <AiOutlineClose
              className={styles.searchIconHidden}
              onClick={clearSearch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;