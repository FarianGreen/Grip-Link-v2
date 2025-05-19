// src/shared/ui/Input/Input.tsx
import React from "react";
import styles from "./Input.module.scss";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, ...rest }) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input id={name} name={name} className={styles.input} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;