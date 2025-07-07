"use client";

import { useSingleProductQuery } from "@/requests/products/product.query";
import Link from "next/link";
import styles from "./productDetail.module.css";
import ProductImage from "@/components/ProductImage/ProductImage";
import Button from "@/components/Button/Button";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";

interface ProductDetailPageProps {
  productId: number;
}

const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const router = useRouter();
  const { data: product, isLoading, error } = useSingleProductQuery(productId);
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const isInCart = cart?.some((item) => item?.id === productId);

  const addProductToCart = () => {
    if (!product) return;
    if (!isInCart) {
      addToCart({
        id: product?.id,
        name: product?.title,
        price: product?.price,
        image: product?.image,
        quantity: 1,
      });
      showToast(t("product.toast.added"), "success");
    } else {
      showToast(t("product.toast.alreadyInCart"), "error");
    }
  };

  const handleAddToCart = () => {
    addProductToCart();
  };

  const handleBuyNow = () => {
    addProductToCart();
    router.push("/cart");
  };

  if (isLoading)
    return <div className={styles.loading}>{t("product.loading")}</div>;

  if (error || !product)
    return <div className={styles.error}>{t("product.notFound")}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">{t("product.breadcrumb.home")}</Link> &gt; {product.title}
      </div>
      <div className={styles.productContainer}>
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            <ProductImage
              src={product.image || "/placeholder-product.jpg"}
              alt={product.title || t("product.noImage")}
              width={500}
              height={500}
              className={styles.productImage}
              priority
            />
          </div>
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.title}</h1>
          <div className={styles.ratingContainer}>
            <div className={styles.stars}>
              {"★".repeat(Math.round(product?.rating?.rate || 0))}
              {"☆".repeat(5 - Math.round(product?.rating?.rate || 0))}
            </div>
            <span className={styles.ratingCount}>
              ({product?.rating?.count} {t("product.reviews")})
            </span>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.price}>{product.price?.toFixed(2)} ₺</span>
          </div>
          <div className={styles.description}>
            <h3>{t("product.description.title")}</h3>
            <p>
              {product.description || t("product.description.notAvailable")}
            </p>
          </div>
          <div className={styles.actionButtons}>
            <Button variant="primary" onClick={handleAddToCart}>
              {t("product.addToCart")}
            </Button>
            <Button variant="danger" onClick={handleBuyNow}>
              {t("product.buyNow")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
