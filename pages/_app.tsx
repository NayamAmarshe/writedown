import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { firebaseApp } from "@/lib/firebase";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { Provider } from "jotai";
import "@/styles/globals.css";

export const auth = getAuth(firebaseApp);

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("preline");
  }, []);

  return (
    <Provider>
      <SkeletonTheme baseColor="#d1d5db">
        <Component {...pageProps} />
      </SkeletonTheme>
      <Toaster />
    </Provider>
  );
}

export default MyApp;
