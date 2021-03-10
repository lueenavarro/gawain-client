import Link from "next/link";
import React from "react";

import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles["header__container"]}>
        <Link href="/">
          <div className={styles["header__title"]}>ONESTEP</div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
