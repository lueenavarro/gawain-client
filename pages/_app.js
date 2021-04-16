import Layout from "../components/Layout";
import { resetServerContext } from "react-beautiful-dnd";

import "../styles/globals.scss";
import 'swiper/swiper.scss';


function OneStep({ Component, pageProps }) {
  resetServerContext();

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default OneStep;
