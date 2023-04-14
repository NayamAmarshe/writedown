import Button from "../ui/Button";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed z-10 flex w-full flex-row justify-between bg-slate-50/50 px-36 py-4 backdrop-blur-md">
      <div className="flex flex-row items-center justify-center gap-2">
        <h4 className="text-2xl font-semibold">writedown</h4>
      </div>
      <div className="flex flex-row">
        <Link href="/login">
          <Button>Try Now</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
