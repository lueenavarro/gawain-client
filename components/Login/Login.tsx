import Link from "next/link";
import React from "react";

import styles from "./Login.module.scss";

const Login = () => {
  return (
    <div className={styles.login}>
      <div className={styles["login__wrapper"]}>
        <h3 className={styles["login__title"]}>Login</h3>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
        <Link href="/signup">
          <a className={styles["login__link"]}>Create an account</a>
        </Link>
      </div>
    </div>
  );
};

export default Login;
