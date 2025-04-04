import Link from "next/link";
import React from "react";
import UserMenu from "./common/UserMenu";
import { RiMenu5Fill } from "react-icons/ri";
import useUser from "./hooks/useUser";

type Props = {};

const Navbar = (props: Props) => {
  const { user } = useUser();

  return (
    <nav className="fixed top-0 z-20 flex w-full flex-row items-center justify-between border-b border-gray-300 bg-transparent p-4 backdrop-blur-sm dark:border-gray-700">
      {/* LOGO */}
      <Link href="/">
        <h4 className="flex items-center text-2xl font-semibold">writedown</h4>
      </Link>
      {/* USER MENU */}
      <div className="flex flex-row items-center gap-4">
        <UserMenu dashboard home logout themeOption reverse>
          {user ? (
            <img
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${user?.displayName}&rounded=true&format=svg&background=random`
              }
              alt="User Photo"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <RiMenu5Fill className="h-7 w-7" />
          )}
        </UserMenu>
      </div>
    </nav>
  );
};

export default Navbar;
