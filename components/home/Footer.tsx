import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-row items-center justify-between bg-slate-200 px-36">
      <div className="py-5">
        <h1 className="text-xl font-semibold">writedown</h1>
      </div>
      <div>
        <ul className="flex flex-row gap-5">
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <a href="https://github.com/NayamAmarshe/writedown">GitHub</a>
          </li>
        </ul>
      </div>
      <div>
        <p className="text-sm">
          © {new Date().getFullYear()} <b>writedown</b>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
