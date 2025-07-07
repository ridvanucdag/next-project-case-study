"use client";

import React from "react";
import styles from "./select.module.css";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  options?: { value: string; label: string }[];
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, options, error, className = "", children, ...props }, ref) => {
    return (
      <div className={`${styles.selectContainer} ${className}`}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={`${styles.select} ${error ? styles.error : ""}`}
          {...props}
        >
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;