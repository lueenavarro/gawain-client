import Head from "next/head";
import React from "react";

import style from "./Layout.module.scss";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Gawain</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Do your thing one step at a time" />
      </Head>
      <main className={style["layout__main"]} data-testid="main">{children}</main>
    </>
  );
};

export default Layout;
