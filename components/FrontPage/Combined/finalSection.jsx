import React from "react";
import Button from "@/components/ui/Button";
export default function FinalSection() {
  return (
    <div className="flex w-screen justify-center bg-slate-200 py-52 dark:bg-slate-800">
      <div className="max-screen-xl flex h-full flex-col items-center justify-center gap-3">
        <h2 className="text-h3 scale-125 sm:scale-100">Still not convinced?</h2>
        <Button variant="dark"> Try it out, it&apos;s FREE!</Button>
      </div>
    </div>
  );
}
