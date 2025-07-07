"use client";

import React from "react";

import styles from "./productcard.module.css";
import { ProductCardProps } from "./ProductCart.type";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import ProductImage from "../ProductImage/ProductImage";
import Button from "../Button/Button";
import { useToast } from "@/contexts/ToastContext";

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  rating,
  price,
}) => {
  const { cart, addToCart, removeFromCart } = useCart()!;
const { showToast } = useToast();
  const isInCart = cart?.some((item) => item?.id === id);

  const handleCartAction = () => {
    if (isInCart) {
      removeFromCart(id);
      showToast('Ürün başarılı bir şekilde kaldırıldı!', 'info');
    } else {
      addToCart({
        id: id,
        name: title,
        price: price,
        image: image,
        quantity: 1,
      });
      
      showToast('Ürün başarılı bir şekilde eklendi!', 'success');
    }

  };

  return (
    <div className={`${styles.card} ${isInCart ? styles.inCart : ""}`}>
      <Link href={`/productDetail/${id}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          <ProductImage
            src={image}
            alt={title}
            width={220}
            height={200}
            className={styles.image}
          />
        </div>
      </Link>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.infoContainer}>
        <p className={styles.rating}>
          <span className={styles.star}>&#9733;</span> {rating.toFixed(1)}
        </p>
        <p className={styles.price}>{price.toFixed(2)} ₺</p>
      </div>

      <Button
        onClick={handleCartAction}
        variant={isInCart ? "danger" : "primary"}
        fullWidth
      >
        {isInCart ? "Sepetten Çıkar" : "Sepete Ekle"}
      </Button>
    </div>
  );
};

export default ProductCard;
