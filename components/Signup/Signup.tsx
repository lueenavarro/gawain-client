import Link from "next/link";
import React from "react";

import styles from "./Signup.module.scss";

const Signup = () => {
  return (
    <div className={styles.signup}>
      <div className={styles["signup__wrapper"]}>
        <h3 className={styles["signup__title"]}>Signup</h3>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Signup</button>
        <Link href="/login">
          <a className={styles["signup__link"]}>{"<"} I have an account already</a>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
