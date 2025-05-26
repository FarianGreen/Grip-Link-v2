import React from "react";
import styles from "./Button.module.scss";
import { cn } from "@/shared/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const classes = cn(
    styles.button,
    styles[variant],
    styles[size],
    className,
    props.disabled && styles.disabled
  );

  return (
    <button className={classes} {...props}>
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
    </button>
  );
};
