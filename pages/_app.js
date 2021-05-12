import { toast, ToastContainer } from "react-toastify";

import Layout from "../components/Layout";
import Header from "../components/Header";
import { AuthProvider, ProtectRoute } from "../contexts/auth";

import "swiper/swiper.scss";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.scss";

function OneStep({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <ToastContainer />
        <Header />
        <ProtectRoute>
          <Component {...pageProps} />
        </ProtectRoute>
      </Layout>
    </AuthProvider>
  );
}

export default OneStep;
