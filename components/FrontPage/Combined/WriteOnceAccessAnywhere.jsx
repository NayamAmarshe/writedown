import React from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";

// This is the 2nd to last section with the "write, once access anywhere" catchphrase

export default function WriteOnceAccessAnywhere() {
  return (
    <div className="flex w-screen justify-center bg-slate-200 py-56 dark:bg-slate-800">
      <div className="max-screen-xl flex h-full items-center justify-center gap-24 px-6">
        {/* TODO: Figure out what to do abou these percentage values */}
        <div className="ml-3 max-w-[90%] sm:max-w-[50%]">
          <h2 className="text-h2">
            write once, <br /> access anywhere
          </h2>
          <p className="text-p">
            writedown lets you export your notes to PDF, Markdown, HTML and
            Text. Print, share or read. writedown gives you the ultimate
            control.
          </p>
          <div className="mt-4">
            <Button variant="dark">Try it now!</Button>
          </div>
        </div>
        <div className="hidden w-[300px] min-w-[300px] sm:block">
          <img
            alt="an image"
            className=""
            width={300}
            height={310}
            src={"/Images/formats.png"}
          ></img>
        </div>
      </div>
    </div>
  );
}
