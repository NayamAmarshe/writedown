import "katex/dist/katex.min.css";
import "./globals.css";
import Providers from "@/components/providers";
import {
  Poppins as PoppinsFont,
  Pacifico as PacificoFont,
  Leckerli_One as LeckerliOneFont,
} from "next/font/google";
import { firebaseApp, functions } from "../lib/firebase";
import { connectFunctionsEmulator } from "firebase/functions";

const poppins = PoppinsFont({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const pacifico = PacificoFont({
  subsets: ["latin"],
  weight: ["400"],
});
const leckerliOne = LeckerliOneFont({
  subsets: ["latin"],
  weight: ["400"],
});

connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${poppins.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
