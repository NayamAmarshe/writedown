import React from "react";
import { children } from "react";
import TBox from "./textbox";

export default function Btn({
  variant = "ui",
  children,
  href = "#",
  backgroundCol = "#FFFFFF",
}) {
  return (
    <div>
      {variant === "ui" && (
        <button
          className="rounded-full border-[1px] border-midnight-400 bg-chalk-50 px-[20px] py-[7px] transition-colors hover:bg-chalk-75 dark:border-dusk-50 dark:bg-midnight-300 dark:hover:bg-dusk-500"
          href={href}
        >
          <TBox variant="ui">{children}</TBox>
        </button>
      )}
      {variant === "page" && (
        <button
          href={href}
          className="rounded-full bg-dusk-400 px-[30px] py-[7px] transition-transform hover:scale-105 dark:bg-midnight-200"
        >
          <p className="font-regular text-[16px] text-text-dark">{children}</p>
        </button>
      )}
      {variant === "custom" && (
        <button
          href={href}
          className="rounded-full px-[30px] py-[7px]"
          style={{ background: backgroundCol }}
        >
          <p className="font-regular text-[16px] text-text-dark">{children}</p>
        </button>
      )}
    </div>
  );
}
