import React from "react";
import { CiGlobe } from "react-icons/ci";

export function FeatureBox({
  icon = <CiGlobe size={35}></CiGlobe>,
  bigText = "loremIpsum",
  smallText = "loremipsumLoremIpsum",
}) {
  return (
    <div className="flex  h-[75px] w-full items-center justify-center gap-4 rounded-2xl transition-all hover:scale-110 md:h-[220px] md:w-[280px] md:flex-col md:gap-1.5 md:bg-slate-300 md:hover:bg-slate-200 md:dark:bg-slate-700 md:hover:dark:bg-slate-600">
      <div className="rounded-2xl bg-slate-300 p-3.5 text-slate-900 dark:bg-slate-700 dark:text-slate-50 md:rounded-[0px] md:bg-transparent md:p-0 md:dark:bg-transparent ">
        {icon}
      </div>
      <div className="h-full text-center md:h-auto">
        <h3 className="text-h3">{bigText}</h3>
        <h5 className="text-h5"> {smallText}</h5>
      </div>
    </div>
  );
}
export function FeatureBoxGrid() {
  return (
    <div className="mb-44 flex w-screen justify-center">
      <div className="max-w-screen-lg">
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
