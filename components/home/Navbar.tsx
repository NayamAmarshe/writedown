import BetaBadge from "../ui/BetaBadge";
import Button from "../ui/Button";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed z-10 flex w-full flex-row justify-between bg-slate-50/50 px-4 py-4 backdrop-blur-md md:px-10 lg:px-36">
      <div className="flex w-full flex-row items-center justify-start gap-2">
        <h4 className="flex items-center text-2xl font-semibold">
          writedown <BetaBadge />
        </h4>
      </div>
      <div className="flex w-full flex-row justify-end">
        <Link href="/login">
          <Button>Try Now</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
