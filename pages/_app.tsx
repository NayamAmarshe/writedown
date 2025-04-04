import { ParallaxProvider } from "react-scroll-parallax";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import "katex/dist/katex.min.css";
import { Provider } from "jotai";
import "@/styles/globals.css";
import { Toaster } from "sonner";

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

        <ParallaxProvider>
          <Component {...pageProps} />
        </ParallaxProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
