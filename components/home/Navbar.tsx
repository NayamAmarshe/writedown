import { FiMoon, FiSun } from "react-icons/fi";
import BetaBadge from "../ui/BetaBadge";
import { useTheme } from "next-themes";
import Button from "../ui/Button";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed z-10 flex w-full flex-row justify-between bg-slate-50/50 px-4 py-4 backdrop-blur-md dark:bg-slate-900/50 md:px-10 lg:px-36">
      <div className="flex w-full flex-row items-center justify-start gap-2">
        <h4 className="flex items-center text-2xl font-semibold">
          writedown <BetaBadge />
        </h4>
      </div>
      <div className="flex w-full flex-row items-center justify-end gap-4">
        <button
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
          }}
        >
          {theme === "light" ? (
            <FiMoon className="h-6 w-6 duration-300 hover:scale-110" />
          ) : (
            <FiSun className="h-6 w-6 duration-300 hover:scale-110" />
          )}
        </button>

        <Link href="/login">
          <Button>Try Now</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
