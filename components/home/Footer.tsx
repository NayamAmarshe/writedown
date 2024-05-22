import { FEATURE_FLAGS } from "@/constants/feature-flags";
import BetaBadge from "../ui/BetaBadge";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import React from "react";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={
        "flex flex-col items-center justify-between gap-2 bg-slate-200 px-4 text-slate-900 dark:bg-slate-700 dark:text-slate-50 sm:flex-row sm:py-4 md:px-10 lg:px-36" +
        " " +
        className
      }
    >
      <div className="pt-4 sm:pt-0">
        <Link href="/" className="text-xl font-semibold">
          writedown {FEATURE_FLAGS.beta && <BetaBadge />}
        </Link>
      </div>
      <div className="text-sm">
        <ul className="flex flex-row gap-5">
          <li>
            <Link href="/login">
              {auth.currentUser ? "Write Down" : "Login"}
            </Link>
          </li>
          <li>
            <a href="https://github.com/NayamAmarshe/writedown">GitHub</a>
          </li>
        </ul>
      </div>
      <div className="pb-5 text-slate-500 dark:text-slate-400 sm:pb-0">
        <p className="text-sm">
          © {new Date().getFullYear()}
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
