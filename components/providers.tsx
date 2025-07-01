"use client";

import { ParallaxProvider } from "react-scroll-parallax";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { Provider } from "jotai";
import { Toaster } from "sonner";

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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

        <ParallaxProvider>{children}</ParallaxProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
