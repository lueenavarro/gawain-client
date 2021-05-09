import React, { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "contexts/auth";

import styles from "./Header.module.scss";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles["header__container"]}>
        <Link href="/">
          <div className={styles["header__title"]}>ONESTEP</div>
        </Link>
        {isAuthenticated && (
          <Fragment>
            <div className={styles.account}>
            <p className={styles["account__email"]}>{user.email}</p>
            <a className={styles["account__logout"]} onClick={logout}>
              Logout
            </a>
            </div>

          </Fragment>
        )}
      </div>
    </header>
  );
};

export default Header;
