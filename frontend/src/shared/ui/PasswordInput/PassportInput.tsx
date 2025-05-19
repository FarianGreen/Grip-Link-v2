import React, { useState } from "react";
import styles from "./PasswordInput.module.scss";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, name, error, ...rest }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible((prev) => !prev);

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} className={styles.label}>{label}</label>
      <div className={styles.passwordWrapper}>
        <input
          type={visible ? "text" : "password"}
          name={name}
          id={name}
          className={styles.input}
          {...rest}
        />
        <div
          
          className={styles.toggle}
          onClick={toggleVisibility}
        >
          {visible ? "🙈" : "👁️"}
        </div>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default PasswordInput;