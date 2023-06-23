import { RiMenu5Fill } from "react-icons/ri";
import { useTheme } from "next-themes";
import Popover from "../ui/Popover";
import { auth } from "@/pages/_app";
import Link from "next/link";
import React from "react";

type UserMenuProps = {
  photoURL?: string | null;
  displayName: string | null;
  reverse?: boolean;
  dashboard?: boolean;
  home?: boolean;
  themeOption?: boolean;
  logout?: boolean;
  showImageAsButton?: boolean;
};

const UserMenu = ({
  photoURL,
  displayName,
  reverse,
  dashboard,
  home,
  themeOption,
  logout,
  showImageAsButton,
}: UserMenuProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Popover
      data-testid="logout"
      buttonStyle="outline-none"
      button={
        showImageAsButton ? (
          <img
            src={
              photoURL ||
              `https://ui-avatars.com/api/?name=${displayName}&rounded=true&format=svg&background=random`
            }
            alt="User Photo"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <RiMenu5Fill className="h-7 w-7" />
        )
      }
      reverse={reverse}
    >
      {dashboard && auth.currentUser && (
        <Link
          href="/dashboard"
          className="rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          ✏️ Dashboard
        </Link>
      )}
      {dashboard && !auth.currentUser && (
        <Link
          href="/login"
          className="rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          ↩️ Login
        </Link>
      )}
      {home && (
        <Link
          href="/"
          className="rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          🏠️ Home
        </Link>
      )}
      {themeOption && (
        <button
          onClick={() => {
            theme === "light" ? setTheme("dark") : setTheme("light");
          }}
          className="rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {theme === "light" ? "🌚 Dark Mode" : "🌞 Light Mode"}
        </button>
      )}
      {logout && auth.currentUser && (
        <button
          onClick={() => auth.signOut()}
          className="rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          🏃 Logout
        </button>
      )}
    </Popover>
  );
};

export default UserMenu;
