import {
  BiHomeAlt,
  BiLogInCircle,
  BiLogOutCircle,
  BiMoon,
  BiPencil,
  BiSun,
} from "react-icons/bi";
import { selectedNoteAtom } from "@/stores/postDataAtom";
import { useTheme } from "next-themes";
import { auth } from "@/lib/firebase";
import { useAtom } from "jotai";
import Link from "next/link";
import React from "react";
import { Popover, PopoverTrigger } from "../ui/Popover";

type UserMenuProps = {
  reverse?: boolean;
  dashboard?: boolean;
  home?: boolean;
  themeOption?: boolean;
  logout?: boolean;
  showImageAsButton?: boolean;
  children?: React.ReactNode;
};

const UserMenu = ({
  reverse,
  dashboard,
  home,
  themeOption,
  logout,
  showImageAsButton,
  children,
}: UserMenuProps) => {
  const { theme, setTheme } = useTheme();
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  return (
    <Popover data-testid="logout">
      {dashboard && auth.currentUser && (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <BiPencil /> writedown
        </Link>
      )}
      {dashboard && !auth.currentUser && (
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <BiLogInCircle className="" /> Login
        </Link>
      )}
      {home && (
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <BiHomeAlt className="" />
          Home
        </Link>
      )}
      {themeOption && (
        <button
          onClick={() => {
            theme === "light" ? setTheme("dark") : setTheme("light");
          }}
          className="flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {theme === "light" ? <BiMoon className="" /> : <BiSun className="" />}
          {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      )}
      {logout && auth.currentUser && (
        <button
          onClick={() => {
            auth.signOut();
            setSelectedNote((prev) => ({
              ...prev,
              id: "",
              isPublic: false,
              title: "",
              content: "",
            }));
          }}
          className="flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <BiLogOutCircle className="" /> Logout
        </button>
      )}
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700">
          {children}
        </button>
      </PopoverTrigger>
    </Popover>
  );
};

export default UserMenu;
