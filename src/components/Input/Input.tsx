
"use client";

import { ChangeEvent, KeyboardEvent, FocusEvent } from "react";
import styles from "./input.module.css";

interface InputProps {
  id?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  inputMode?: "decimal" | "text" | "numeric" | "search" | "email" | "tel" | "url";
  className?: string;
}

const Input = ({
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  inputMode,
  className = "",
}: InputProps) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      inputMode={inputMode}
      className={`${styles.input} ${className}`}
    />
  );
};

export default Input;