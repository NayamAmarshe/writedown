import React from "react";
import TBox from "../textbox";
import Btn from "../button";

export default function FinalSection() {
  return (
    <div className="flex h-[400px] w-screen justify-center bg-slate-200 dark:bg-slate-800">
      <div className="flex h-full max-w-[1200px] flex-col items-center justify-center gap-3">
        <TBox variant="h2">Still not convinced?</TBox>
        <Btn variant="page"> {" Try it out, it's FREE! "}</Btn>
      </div>
    </div>
  );
}
