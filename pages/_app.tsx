import { connectAuthEmulator, getAuth } from "firebase/auth";
import { ParallaxProvider } from "react-scroll-parallax";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { firebaseApp } from "@/lib/firebase";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { Provider } from "jotai";
import "@/styles/globals.css";
import Head from "next/head";

export const auth = getAuth(firebaseApp);

const env = process.env["NODE_ENV"];
if (env === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Head>
        <title>writedown - markdown notes app</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#317EFB" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <meta name="application-name" content="writedown" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="writedown - Markdown Notes"
        />
        <meta
          name="description"
          content="writedown - A Free and Open Source Markdown Notes App with Cloud Sync, Offline Support and a Beautiful Interface."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://writedown.app" />
        <meta name="twitter:title" content="writedown - Markdown Notes" />
        <meta
          name="twitter:description"
          content="writedown - A Free and Open Source Markdown Notes App with Cloud Sync, Offline Support and a Beautiful Interface."
        />
        <meta
          name="twitter:image"
          content="https://writedown.app/og-image.png"
        />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="writedown - Markdown Notes" />
        <meta
          property="og:description"
          content="writedown - A Free and Open Source Markdown Notes App with Cloud Sync, Offline Support and a Beautiful Interface."
        />
        <meta property="og:site_name" content="writedown" />
        <meta property="og:url" content="https://writedown.app" />
        <meta
          property="og:image"
          content="https://writedown.app/og-image.png"
        />
      </Head>
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
