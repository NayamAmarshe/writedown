import React from "react";
import { CiGlobe } from "react-icons/ci";
import TBox from "./textbox";

export function FeatureBox({
  icon = <CiGlobe size={35}></CiGlobe>,
  bigText = "loremIpsum",
  smallText = "loremipsumLoremIpsum",
}) {
  return (
    <div className="flex  h-[75px] w-full items-center justify-center gap-[15px] rounded-[12px] transition-all hover:scale-110 md:h-[220px] md:w-[280px] md:flex-col md:gap-[7px] md:bg-chalk-200 md:hover:bg-chalk-75 md:dark:bg-slate-700 md:hover:dark:bg-slate-600">
      <div className="rounded-[12px] bg-chalk-200 p-3.5 text-text-light dark:bg-slate-700 dark:text-text-dark md:rounded-[0px] md:bg-transparent md:p-0 md:dark:bg-transparent ">
        {icon}
      </div>
      <div className="h-full text-center md:h-auto">
        <TBox variant="h3">{bigText}</TBox>
        <TBox variant="h5"> {smallText}</TBox>
      </div>
    </div>
  );
}
export function FeatureBoxGrid() {
  return (
    <div className="mb-44 flex w-screen justify-center">
      <div className="max-w-[1000px]">
        <div className="flex w-full flex-col gap-12  md:grid md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2">
          <FeatureBox></FeatureBox>
          <FeatureBox></FeatureBox>
          <FeatureBox></FeatureBox>
          <FeatureBox></FeatureBox>
          <FeatureBox></FeatureBox>
          <FeatureBox></FeatureBox>
        </div>
      </div>
    </div>
  );
}
