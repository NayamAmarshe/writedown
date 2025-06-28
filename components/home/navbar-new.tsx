import { FEATURE_FLAGS } from "@/constants/feature-flags";
import BetaBadge from "../ui/BetaBadge";
import { useTheme } from "next-themes";
import { auth } from "@/lib/firebase";
import useMounted from "../hooks/useMounted";
import { Button } from "../ui/button";
import Link from "next/link";
import { MoonIcon, SunIcon } from "lucide-react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const isMounted = useMounted();

  return (
    <nav className="fixed z-10 flex w-full flex-row justify-between bg-slate-50/50 px-4 py-4 backdrop-blur-md md:px-10 lg:px-36 dark:bg-slate-900/50">
      <div className="flex w-full flex-row items-center justify-start gap-2">
        <Link href="/">
          <h4 className="flex items-center text-2xl font-semibold">
            writedown {FEATURE_FLAGS.beta && <BetaBadge />}
          </h4>
        </Link>
      </div>
      <div className="flex w-full flex-row items-center justify-end gap-4">
        <button
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
          }}
        >
          {isMounted && theme === "light" ? (
            <MoonIcon className="h-6 w-6 duration-300 hover:scale-110" />
          ) : (
            <SunIcon className="h-6 w-6 duration-300 hover:scale-110" />
          )}
        </button>

        <Link href="/login" className="hidden sm:block">
          <Button>{auth.currentUser ? "Write Now" : "Try Now"}</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
