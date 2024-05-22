import React from "react";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { useTheme } from "next-themes";

//useTheme provided by the next-themes package (godsent)

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <button
        onClick={() => setTheme("dark")}
        className="block text-slate-900 dark:hidden"
      >
        <CiLight size={23}></CiLight>
      </button>
      <button
        onClick={() => setTheme("light")}
        className="hidden text-slate-50 dark:block"
      >
        <CiDark size={23}></CiDark>
      </button>
    </div>
  );
}
