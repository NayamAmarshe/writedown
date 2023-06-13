import BetaBadge from "../ui/BetaBadge";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 bg-slate-200 px-4 text-slate-900 sm:flex-row sm:py-4 md:px-10 lg:px-36">
      <div className="pt-4 sm:pt-0">
        <Link href="/" className="text-xl font-semibold">
          writedown <BetaBadge />
        </Link>
      </div>
      <div className="text-sm">
        <ul className="flex flex-row gap-5">
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <a href="https://github.com/NayamAmarshe/writedown">GitHub</a>
          </li>
        </ul>
      </div>
      <div className="pb-5 text-slate-500 sm:pb-0">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <Link href="/" className="font-semibold">
            writedown
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
