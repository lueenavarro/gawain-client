import React from "react";
import styles from "./Button.module.scss";

const Button = ({
  children = null,
  type = "button" as "button" | "submit" | "reset",
  disabled = false,
  invert = false,
  onClick = null,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.button} ${invert ? styles.white : styles.black}`}
      onClick={onClick ? onClick : undefined}
    >
      {children}
    </button>
  );
};

export default Button;
