import React from "react";
import { children } from "react";
import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700"] });

export default function TBox({ children, variant = "p" }) {
  return (
    <div>
      {variant === "special" && (
        <h1
          className={`${syne.className} text-center text-[40px] font-bold text-text-light dark:text-text-dark sm:text-[65px]`}
        >
          {children}
        </h1>
      )}
      {variant === "h1" && (
        <h1 className="text-[38px] font-bold text-text-light dark:text-text-dark sm:text-[52px]">
          {children}
        </h1>
      )}
      {variant === "h2" && (
        <h2 className="text-[32px] font-bold text-text-light dark:text-text-dark sm:text-[42px]">
          {children}
        </h2>
      )}
      {variant === "h3" && (
        <h3 className="text-[24px] font-semibold text-text-light dark:text-text-dark sm:text-[36px]">
          {children}
        </h3>
      )}{" "}
      {variant === "h4" && (
        <h4 className="text-[20px] font-medium text-text-light dark:text-text-dark sm:text-[28px]">
          {children}
        </h4>
      )}
      {variant === "h5" && (
        <h5 className="text-[22px] text-text-light dark:text-text-dark sm:text-[18px]">
          {children}
        </h5>
      )}
      {variant === "p" && (
        <p className="text-[18px] text-text-light dark:text-text-dark">
          {children}
        </p>
      )}
      {variant === "ui" && (
        <p className="font-regular text-[16px] text-text-light dark:text-text-dark">
          {children}
        </p>
      )}
    </div>
  );
}
