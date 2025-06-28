import { Parallax } from "react-scroll-parallax";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { LinkIcon } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="my-32 h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center gap-20 px-4">
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="xs:text-5xl flex flex-col gap-5 text-center text-4xl leading-tight font-semibold text-slate-900 sm:text-7xl dark:text-slate-50">
            <span className="whitespace-nowrap">Upgrade Your</span>
            <span className="text-pacifico font-light whitespace-nowrap">
              Dear Diary
            </span>
          </h1>

          <p className="xs:text-xl mt-4 max-w-lg text-center text-base font-medium text-slate-800 dark:text-slate-200">
            All your notes, synced on all your devices. <br />
            Free, easy and fast.
          </p>

          <div>
            <Link href="/login">
              <Button variant="outline" size="lg">
                {auth.currentUser ? "Write Now" : "Try Now"}
              </Button>
            </Link>
          </div>
        </div>

        <Parallax speed={10}>
          <img
            src="/screenshot.png"
            alt="Writedown Screenshot"
            className="dark:hidden"
          />
          <img
            src="/dark-screenshot.png"
            alt="Writedown Screenshot"
            className="hidden dark:block"
          />
        </Parallax>
      </div>
    </div>
  );
};

export default HeroSection;
