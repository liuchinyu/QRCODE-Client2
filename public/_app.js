import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/style.css";
// import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  // 確保 Bootstrap 的 JavaScript 在客戶端運行
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
