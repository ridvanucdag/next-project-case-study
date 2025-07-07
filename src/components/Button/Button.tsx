'use client';

import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'ghost' | 'success' | 'light'| 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  shape?: 'rectangle' | 'rounded' | 'pill';
  hoverEffect?: 'scale' | 'shadow' | 'slide' | 'none';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  shape = 'rounded',
  hoverEffect = 'scale',
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${styles[shape]}
        ${hoverEffect !== 'none' ? styles[`hover-${hoverEffect}`] : ''}
        ${fullWidth ? styles.fullWidth : ''}
        ${loading ? styles.loading : ''}
        ${className}
      `}
      data-loading={loading}
    >
      {loading && (
        <span className={styles.spinnerContainer}>
          <FaSpinner className={styles.spinner} />
        </span>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className={styles.iconLeft}>{icon}</span>
      )}
      
      <span className={styles.content}>
        {children}
      </span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span className={styles.iconRight}>{icon}</span>
      )}
    </button>
  );
};

export default Button;