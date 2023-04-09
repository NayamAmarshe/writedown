import { connectAuthEmulator, getAuth } from "firebase/auth";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { firebaseApp } from "@/lib/firebase";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { Provider } from "jotai";
import "@/styles/globals.css";

export const auth = getAuth(firebaseApp);

const env = process.env.NODE_ENV;
if (env == "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      {/* EXTRA DIV IS BECAUSE OF TOAST */}
      <Toaster />
      <SkeletonTheme
        baseColor="#e2e8f0"
        highlightColor="#f8fafc"
        borderRadius={10}
      >
        <Component {...pageProps} />
      </SkeletonTheme>
    </Provider>
  );
}

export default MyApp;
