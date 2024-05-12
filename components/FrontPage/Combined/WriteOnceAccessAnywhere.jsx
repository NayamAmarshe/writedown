import React from "react";
import TBox from "../textbox";
import Btn from "../button";
import Image from "next/image";

// This is the 2nd to last section with the "write, once access anywhere" catchphrase

export default function WriteOnceAccessAnywhere() {
  return (
    <div className="flex h-[700px] w-screen justify-center bg-slate-200 dark:bg-slate-800">
      <div className="flex h-full max-w-[1200px] items-center justify-center gap-24 px-6">
        <div className="ml-3 max-w-[90%] sm:max-w-[50%]">
          {" "}
          <TBox variant="h2">write once,</TBox>
          <TBox variant="h2">access anywhere</TBox>
          <TBox variant="p">
            writedown lets you export your notes to PDF, Markdown, HTML and
            Text. Print, share or read. writedown gives you the ultimate
            control.
          </TBox>
          <div className="mt-4">
            <Btn variant="page">Try it now!</Btn>
          </div>
        </div>
        <div className="hidden w-[300px] min-w-[300px] sm:block">
          <Image
            className=""
            width={300}
            height={310}
            src={"/Images/formats.png"}
          ></Image>
        </div>
      </div>
    </div>
  );
}
