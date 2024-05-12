"use client";
import React from "react";
import Btn from "./button";
import ThemeSwitcher from "./themeSwitcher";
import { useState, useEffect } from "react";

export default function TopBar() {
  // Logic for changing the scrollbar whenever it's not at the very top
  const [isAtTop, setIsAtTop] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsAtTop(scrollTop === 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //TODO: figure out a better way to scale the topbar, currently it just hides the middle section
  return (
    <nav
      className="fixed left-1 right-1 top-1 z-30 grid h-[63px] grid-cols-2 rounded-full border-midnight-400 bg-chalk-50 px-[20px] transition-all dark:border-dusk-50 dark:bg-midnight-300 sm:grid-cols-3"
      style={{
        borderWidth: isAtTop ? "0px" : "1px",
        top: isAtTop ? "0px" : "4px",
        left: isAtTop ? "0px" : "4px",
        right: isAtTop ? "0px" : "4px",
        borderRadius: isAtTop ? "0px" : "9999px",
      }}
    >
      {/* Logo */}
      <div className="flex h-full w-full  items-center justify-start">
        <div>
          <h3 className="text-xl font-semibold text-slate-950 dark:invert">
            writedown.
          </h3>
        </div>
      </div>
      {/* Middle buttons */}
      <div className="hidden h-full w-full items-center  justify-center gap-5 sm:flex">
        <a
          className="text-[16px] text-text-light hover:underline dark:text-text-dark"
          href="#"
        >
          Product
        </a>
        <a
          className="text-[16px] text-text-light hover:underline dark:text-text-dark"
          href="#"
        >
          About
        </a>
        <a
          className="text-[16px] text-text-light hover:underline dark:text-text-dark"
          href="#"
        >
          GitHub
        </a>
      </div>
      {/* Right buttons */}
      <div className="flex h-full w-full  items-center justify-end gap-3 ">
        <ThemeSwitcher></ThemeSwitcher>
        <div className="mxs:hidden">
          <Btn variant="ui">Write now!</Btn>
        </div>
      </div>
    </nav>
  );
}
