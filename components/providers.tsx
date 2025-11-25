"use client";

import { ParallaxProvider } from "react-scroll-parallax";
import { ThemeProvider } from "next-themes";
import { Provider } from "jotai";
import { Toaster } from "sonner";
import AuthProvider from "@/components/providers/auth-provider";

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Provider>
      <ThemeProvider attribute="class" defaultTheme="system" storageKey="theme">
        {/* EXTRA DIV IS BECAUSE OF TOAST */}
        <Toaster position="top-center" />

        <ParallaxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ParallaxProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
