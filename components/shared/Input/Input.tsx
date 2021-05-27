import React from "react";
import styles from "./Input.module.scss";

const Input = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error
}) => {
  return (
    <div className={styles.group}>
      <input
        className={styles.input}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <div className={styles.error}>{error}</div>
    </div>
  );
};

export default Input;
