import { ParallaxProvider } from "react-scroll-parallax";
import { SkeletonTheme } from "react-loading-skeleton";
import { ThemeProvider } from "next-themes";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import "katex/dist/katex.min.css";
import { Provider } from "jotai";
import "@/styles/globals.css";

// const env = process.env.NODE_ENV;
// if (env === "development") {
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme);
    } else {
      setTheme("light");
    }
  }, []);

  return (
    <Provider>
      <ThemeProvider attribute="class">
        {/* EXTRA DIV IS BECAUSE OF TOAST */}
        <Toaster position="top-center" />
        <SkeletonTheme
          baseColor={theme === "light" ? "#e2e8f0" : "#0f172a"}
          highlightColor={theme === "light" ? "#f8fafc" : "#1e293b"}
          borderRadius={10}
        >
          <ParallaxProvider>
            <Component {...pageProps} />
          </ParallaxProvider>
        </SkeletonTheme>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
