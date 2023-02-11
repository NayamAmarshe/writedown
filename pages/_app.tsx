import { firebaseApp } from "@/lib/firebase";
import type { AppProps } from "next/app";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import "../styles/globals.css";

export const auth = getAuth(firebaseApp);

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("preline");
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
