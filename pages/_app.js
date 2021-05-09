import Layout from "../components/Layout";
import Header from "../components/Header";
import { AuthProvider, ProtectRoute } from "../contexts/auth";

import "../styles/globals.scss";
import "swiper/swiper.scss";

function OneStep({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Header />
        <ProtectRoute>
          <Component {...pageProps} />
        </ProtectRoute>
      </Layout>
    </AuthProvider>
  );
}

export default OneStep;
