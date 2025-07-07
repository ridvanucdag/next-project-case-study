"use client";
import "@/i18n";
import React, { useState } from "react";
import { FaShoppingCart, FaBars, FaUser } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";
import styles from "./header.module.css";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { cart } = useCart()!;
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const handleSearch = (term: string) => {
    const trimmedTerm = term?.trim();
    if (trimmedTerm) {
      router?.push(`/?q=${encodeURIComponent(trimmedTerm)}`);
      setSearchTerm("");
      setIsSearchVisible(false);
    }
  };

  const totalItems = cart?.reduce((sum, item) => sum + item?.quantity, 0);

  return (
    <header>
      <div className={styles.header}>
        <div className={styles.leftSection}>
          <div className={styles.hamburgerMenuIcon}>
            <FaBars />
          </div>
          <Link className={styles.productLink} href="/">
            <h1 className={styles.title}>SeturCase</h1>
          </Link>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearchVisible={isSearchVisible}
          setIsSearchVisible={setIsSearchVisible}
          onSearch={handleSearch}
          onToggleSearch={toggleSearch}
        />

        <div className={styles.rightSection}>
          <div className={styles.mobileIcons}>
            <AiOutlineSearch
              className={styles.searchHeaderIcon}
              onClick={toggleSearch}
            />
            <Link href="/cart" className={styles.cartIconContainer}>
              <FaShoppingCart className={styles.mobileCartIcon} />
              {totalItems > 0 && (
                <span className={styles.mobileCartBadge}>{totalItems}</span>
              )}
            </Link>
          </div>
          <div className={styles.cartContainers}>
            <Link href="/cart" className={styles.iconContainer}>
              <FaShoppingCart className={styles.icon} />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </Link>
          </div>
          <button
            onClick={toggleTheme}
            className={`${styles.themeToggleButton} ${
              theme === "light" ? styles.light : styles.dark
            }`}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            <div className={styles.toggleCircle}></div>
          </button>
          <div className={styles.userProfile}>
            <FaUser className={styles.userIcon} />
            <span className={styles.userName}>Rıdvan Üçdağ</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
