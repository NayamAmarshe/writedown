import React from "react";

import TBox from "../textbox";

export function CathPhrase1() {
  return (
    <div className="text-center">
      <TBox variant="h3">Still using & paper?</TBox>
      <h4 className="text-[30px] text-slate-400">
        Cmon now, it&apos;s not the 90s anymore
      </h4>
    </div>
  );
}

export function MainTitle() {
  return (
    <div>
      <TBox variant="special">Upgrade your</TBox>
      <TBox variant="special">Dear Diary</TBox>
      <h2 className="text-center text-[12px] text-slate-600 dark:text-text-dark sm:text-[24px]">
        The easiest way to write down
      </h2>
    </div>
  );
}
