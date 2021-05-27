import React from "react";
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles["dot-typing"]}></div>
    </div>
  );
};

export default Loading;
