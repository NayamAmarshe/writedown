import React from "react";
import { children } from "react";

// Unused, will remove later
export default function ButtonFp({
  variant = "ui",
  children,
  href = "#",
  backgroundCol = "#FFFFFF",
}) {
  return (
    <div>
      {variant === "ui" && (
        <button
          className="rounded-full border border-slate-800 bg-slate-50 p-5 py-1.5 transition-colors hover:bg-slate-200 dark:border-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
          href={href}
        >
          <p className="text-ui">{children}</p>
        </button>
      )}
      {variant === "page" && (
        <button
          href={href}
          className="rounded-full bg-slate-800 px-[30px] py-1.5 transition-transform hover:scale-105 dark:bg-slate-600"
        >
          <p className="font-regular text-[16px] text-slate-50">{children}</p>
        </button>
      )}
      {variant === "custom" && (
        <button
          href={href}
          className="rounded-full px-[30px] py-1.5"
          style={{ background: backgroundCol }}
        >
          <p className="font-regular text-[16px] text-slate-50">{children}</p>
        </button>
      )}
    </div>
  );
}
