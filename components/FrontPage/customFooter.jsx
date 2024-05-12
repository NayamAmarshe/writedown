import React from "react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bottom-0 left-0 right-0 grid h-[80px] grid-cols-2 bg-midnight-300 px-[50px] lg:grid-cols-3">
      {/* things on the left */}
      <div className="flex h-full items-center">
        <div className="text-[12px] text-text-dark lg:text-[18px]">
          ©2024 <b>writedown.</b> All rights reserved.
        </div>
      </div>
      {/* Things in the middle */}
      <div className=" hidden h-full w-full items-center justify-center text-text-dark lg:flex">
        <FaGithub size={40}></FaGithub>
      </div>
      {/* Things on the right */}
      <div className="flex h-full w-full items-center justify-end gap-1 md:gap-5">
        <p className="text-[10px] text-text-dark sm:text-[16px]">
          Like what you see?
        </p>
        <button
          className="rounded-full border-[1px] border-dusk-50 bg-midnight-300 px-[10px] py-[3px] transition-colors  dark:hover:bg-dusk-500 md:px-[20px]  md:py-[7px]"
          href="#"
        >
          <p className="font-regular text-[10px] text-text-dark sm:text-[16px]">
            Support the project!
          </p>{" "}
        </button>
      </div>
    </footer>
  );
}
