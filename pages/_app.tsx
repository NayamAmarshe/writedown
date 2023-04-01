import "react-loading-skeleton/dist/skeleton.css";
import { firebaseApp } from "@/lib/firebase";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { getAuth } from "firebase/auth";
import { Provider } from "jotai";
import "@/styles/globals.css";

export const auth = getAuth(firebaseApp);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      {/* EXTRA DIV IS BECAUSE OF TOAST */}
      <Toaster />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
