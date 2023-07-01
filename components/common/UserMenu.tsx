import {
  BiHomeAlt,
  BiLogInCircle,
  BiLogOutCircle,
  BiMoon,
  BiPencil,
  BiSun,
} from "react-icons/bi";
import {
  postContentAtom,
  postPublicAtom,
  postTitleAtom,
} from "@/stores/postDataAtom";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useTheme } from "next-themes";
import Popover from "../ui/Popover";
import { auth } from "@/pages/_app";
import { useSetAtom } from "jotai";
import Link from "next/link";
import React from "react";

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
  const setSelectedNoteId = useSetAtom(selectedNoteIdAtom);
  const setPostPublic = useSetAtom(postPublicAtom);
  const setPostTitle = useSetAtom(postTitleAtom);
  const setPostContent = useSetAtom(postContentAtom);

  return (
    <Popover
      data-testid="logout"
      buttonStyle="outline-none"
      button={<>{children}</>}
      reverse={reverse}
    >
      {dashboard && auth.currentUser && (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <BiPencil /> Write Down
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
            setSelectedNoteId("");
            setPostPublic(false);
            setPostTitle("");
            setPostContent("");
          }}
          className="flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <BiLogOutCircle className="" /> Logout
        </button>
      )}
    </Popover>
  );
};

export default UserMenu;
