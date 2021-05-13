import React, { Fragment, useState } from "react";
import Link from "next/link";

import { useAuth } from "contexts/auth";
import Sidebar from "components/Sidebar";

import styles from "./Header.module.scss";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [sidebarOpened, setSidebarOpened] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles["header__container"]}>
        <Link href="/">
          <div className={styles["header__title"]}>GAWAIN</div>
        </Link>
        {isAuthenticated && (
          <Fragment>
            <div className={styles.account}>
              <p className={styles["account__email"]}>{user.email}</p>
              <a className={styles["account__logout"]} onClick={logout}>
                Logout
              </a>
            </div>
            <div className={styles.sidebar}>
              <div
                className={styles["sidebar__hamburger"]}
                onClick={() => setSidebarOpened(!sidebarOpened)}
              ></div>
              <Sidebar
                opened={sidebarOpened}
                onClose={() => setSidebarOpened(false)}
              />
            </div>
          </Fragment>
        )}
      </div>
    </header>
  );
};

export default Header;
