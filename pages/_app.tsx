import { connectAuthEmulator, getAuth } from "firebase/auth";
import { ParallaxProvider } from "react-scroll-parallax";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { firebaseApp } from "@/lib/firebase";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { Provider } from "jotai";
import "@/styles/globals.css";

export const auth = getAuth(firebaseApp);

const env = process.env["NODE_ENV"];
if (env === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      {/* EXTRA DIV IS BECAUSE OF TOAST */}
      <Toaster position="top-center" />
      <SkeletonTheme
        baseColor="#e2e8f0"
        highlightColor="#f8fafc"
        borderRadius={10}
      >
        <ParallaxProvider>
          <Component {...pageProps} />
        </ParallaxProvider>
      </SkeletonTheme>
    </Provider>
  );
}

export default MyApp;
