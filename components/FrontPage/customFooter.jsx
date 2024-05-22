import React from "react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bottom-0 left-0 right-0 grid grid-cols-2 bg-slate-900 px-[50px] py-5 lg:grid-cols-3">
      {/* things on the left */}
      <div className="flex h-full items-center">
        <div className="text-xs text-slate-50 lg:text-base">
          ©2024 <b>writedown.</b> All rights reserved.
        </div>
      </div>
      {/* Things in the middle */}
      <div className=" hidden h-full w-full items-center justify-center text-slate-50 lg:flex">
        <FaGithub size={40}></FaGithub>
      </div>
      {/* Things on the right */}
      <div className="flex h-full w-full items-center justify-end gap-1 md:gap-5">
        <button
          className="rounded-full border border-slate-100 bg-slate-900 px-[10px] py-[3px] transition-colors  dark:hover:bg-slate-800 md:p-5  md:py-1.5"
          href="#"
        >
          <p className="font-regular text-[10px] text-slate-50 sm:text-sm">
            Support the project!
          </p>{" "}
        </button>
      </div>
    </footer>
  );
}
