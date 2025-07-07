"use client";

import { CartItem, useCart } from "@/contexts/CartContext";
import styles from "./cart.module.css";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import ProductImage from "@/components/ProductImage/ProductImage";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
   const { t } = useTranslation();
  const subtotal = cart?.reduce(
    (sum, item) => sum + item?.price * item?.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 29.99;
  const total = subtotal + shipping;

  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = item?.quantity + change;
    if (newQuantity > 0) {
      updateQuantity(item?.id, newQuantity);
    } else {
      removeFromCart(item?.id);
    }
  };

    const handleHomePage = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Button
            variant="ghost"
            size="sm"
            icon={<FiArrowLeft />}
            onClick={handleHomePage}
            className={styles.backButton}

          >
            <span className={styles.buttonText}>{t("cart.continueShopping")}</span>
          </Button>

          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiShoppingBag className={styles.titleIcon} />
            <span>{t("cart.cartTitle")}</span>
            {cart.length > 0 && (
              <motion.span 
                className={styles.itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {cart.reduce((sum, item) => sum + item?.quantity, 0)}
              </motion.span>
            )}
          </motion.h1>

          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={clearCart}
                variant="text"
                size="sm"
                icon={<FiTrash2 />}
                className={styles.clearCart}
                aria-label={t("cart.clearCart")}
              >
                <span className={styles.buttonText}>{t("cart.clearCart")}</span>
              </Button>
            </motion.div>
          )}
        </div>
      </header>


      <AnimatePresence>
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={styles.emptyCart}
          >
            <div className={styles.emptyCartIllustration}>
              <div className={styles.cartIcon}>
                <FiShoppingBag />
              </div>
              <div className={styles.emptyIndicator} />
            </div>
            <h2>{t("cart.cartEmptyTitle")}</h2>
            <p>
              {t("cart.cartEmptyDesc")}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleHomePage}
              className={styles.continueShopping}
            >
              {t("cart.discoverProducts")}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={styles.cartLayout}
          >
            <div className={styles.cartItems}>
              {cart?.map((item) => (
                <motion.div
                  key={item?.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className={styles.cartItem}
                >
                  <Link
                    href={`/productDetail/${item.id}`}
                    className={styles.productLink}
                  >
                    <div className={styles.productImage}>
                      <ProductImage
                        src={item?.image}
                        alt={item?.name}
                        width={140}
                        height={140}
                        priority
                      />
                    </div>
                  </Link>

                  <div className={styles.productInfo}>
                    <Link
                      href={`/productDetail/${item.id}`}
                      className={styles.productLink}
                    >
                      <h3 className={styles.productName}>{item.name}</h3>
                      <p className={styles.productPrice}>
                        {item?.price?.toFixed(2)} ₺
                      </p>
                    </Link>

                    <div className={styles.quantityControls}>
                      <Button
                        onClick={() => handleQuantityChange(item, -1)}
                        variant="outline"
                        size="sm"
                        icon={<FiMinus />}
                        disabled={item?.quantity <= 1}
                        aria-label={t("cart.quantityDecrease")}
                        className={styles.quantityButton}
                      />

                      <span className={styles.quantity}>{item?.quantity}</span>

                      <Button
                        onClick={() => handleQuantityChange(item, 1)}
                        variant="outline"
                        size="sm"
                        icon={<FiPlus />}
                        aria-label={t("cart.quantityIncrease")}
                        className={styles.quantityButton}
                      />
                    </div>
                  </div>

                  <div className={styles.productSubtotal}>
                    <p className={styles.subtotal}>
                      {(item?.price * item?.quantity)?.toFixed(2)} ₺
                    </p>

                    <Button
                      onClick={() => removeFromCart(item?.id)}
                      variant="text"
                      size="sm"
                      icon={<FiTrash2 />}
                      aria-label={t("cart.remove")}
                      className={styles.removeButton}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.orderSummary}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>{t("cart.orderSummary")}</h2>

                <div className={styles.summaryRow}>
                  <span>{t("cart.products")}</span>
                  <span>{subtotal?.toFixed(2)} ₺</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t("cart.shipping")}</span>
                  <span>
                    {shipping === 0 ? (
                      <span className={styles.freeShipping}>{t("cart.freeShipping")}</span>
                    ) : (
                      `${shipping.toFixed(2)} ₺`
                    )}
                  </span>
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.summaryTotal}>
                  <span>{t("cart.total")}</span>
                  <span className={styles.totalPrice}>
                    {total?.toFixed(2)} ₺
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<HiOutlineArrowLongRight />}
                  iconPosition="right"
                  className={styles.checkoutButton}
                >
                  {t("cart.securePayment")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}