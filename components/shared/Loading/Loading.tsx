import React from "react";
import styles from "./Loading.module.scss";

const Loading = () => {
  console.log(styles);
  return (
    <div style={{
      margin: "20px auto"
    }}>
      <div className={styles["dot-typing"]}></div>
    </div>
  );
};

export default Loading;
