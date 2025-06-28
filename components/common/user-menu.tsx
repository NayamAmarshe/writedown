import { selectedNoteAtom } from "@/stores/postDataAtom";
import { useTheme } from "next-themes";
import { auth } from "@/lib/firebase";
import { useAtom } from "jotai";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MoonIcon,
  PencilIcon,
  SunIcon,
} from "lucide-react";

type UserMenuProps = {
  reverse?: boolean;
  dashboard?: boolean;
  home?: boolean;
  themeOption?: boolean;
  logout?: boolean;
  showImageAsButton?: boolean;
  children?: React.ReactNode;
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
};

const UserMenu = ({
  reverse,
  dashboard,
  home,
  themeOption,
  logout,
  showImageAsButton,
  children,
  avatarSrc,
  avatarAlt,
  avatarFallback,
}: UserMenuProps) => {
  const { theme, setTheme } = useTheme();
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity ring-none focus:ring-0">
            <AvatarImage src={avatarSrc} alt={avatarAlt} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 translate-x-8 !text-slate-900 dark:!text-slate-50 font-medium">
        {dashboard && auth.currentUser && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <PencilIcon /> writedown
            </Link>
          </DropdownMenuItem>
        )}
        {dashboard && !auth.currentUser && (
          <DropdownMenuItem asChild>
            <Link href="/login" className="flex items-center gap-2">
              <LogInIcon /> Login
            </Link>
          </DropdownMenuItem>
        )}
        {home && (
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2 font-medium">
              <HomeIcon className="size-4 !text-slate-900 dark:!text-slate-50" />
              Home
            </Link>
          </DropdownMenuItem>
        )}
        {themeOption && (
          <DropdownMenuItem
            onClick={() => {
              theme === "light" ? setTheme("dark") : setTheme("light");
            }}
            className="flex items-center gap-2"
          >
            {theme === "light" ? (
              <MoonIcon className="size-4 text-slate-900 dark:text-slate-50" />
            ) : (
              <SunIcon className="size-4 text-slate-900 dark:text-slate-50" />
            )}
            {theme === "light" ? "Dark" : "Light"} Mode
          </DropdownMenuItem>
        )}
        {logout && auth.currentUser && (
          <DropdownMenuItem
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
            className="flex items-center gap-2"
          >
            <LogOutIcon className="size-4 text-slate-900 dark:text-slate-50" />
            Logout
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
