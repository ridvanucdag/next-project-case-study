"use client";

import styles from "./page.module.css";
import ProductsPage from "@/app/pages/products/page";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <ProductsPage/>
        </div>
      </main>
    </div>
  );
}
