import React from "react";
import TBox from "../textbox";
import { RiGithubFill } from "react-icons/ri";
import { RiNextjsFill } from "react-icons/ri";
import { RiFirebaseFill } from "react-icons/ri";
import { RiTailwindCssFill } from "react-icons/ri";

// TODO: ask nayamamarshe if these are links or not
import Image from "next/image";

export default function UsedTechnologies({}) {
  return (
    <div className="flex h-[400px] w-screen justify-center">
      <div className="flex h-full max-w-[1200px] flex-col items-center justify-center text-center">
        <TBox variant="h3">
          Built on the foundation of trust and open source
        </TBox>
        <div className="mt-5 flex gap-6 sm:gap-12">
          <RiGithubFill
            className="w-[40px] sm:w-[60px]"
            size={60}
          ></RiGithubFill>
          <RiNextjsFill
            className="w-[40px] sm:w-[60px]"
            size={60}
          ></RiNextjsFill>
          <RiFirebaseFill
            className="w-[40px] sm:w-[60px]"
            size={60}
          ></RiFirebaseFill>
          <RiTailwindCssFill
            className="w-[40px] sm:w-[60px]"
            size={60}
          ></RiTailwindCssFill>
        </div>
      </div>
    </div>
  );
}
