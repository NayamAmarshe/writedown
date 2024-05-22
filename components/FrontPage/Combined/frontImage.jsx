import React from "react";
import Image from "next/image";

export default function FrontImage() {
  return (
    <div className="flex w-full flex-col items-center gap-12">
      {/* Desktop light */}
      <img
        className="hidden w-[85vw] max-w-[1000px] sm:block dark:sm:hidden"
        width={1200}
        height={900}
        src={"/Images/image1.png"}
      ></img>
      {/* Mobile light */}
      <img
        className="customShadow block w-[90vw] max-w-[300px] rounded-[12px] dark:hidden sm:hidden dark:sm:hidden"
        width={500}
        height={900}
        src={"/Images/image1-mbl.png"}
      ></img>
      {/* Desktop dark */}
      <img
        className="hidden w-[80vw] max-w-[1000px]  dark:sm:block "
        width={1200}
        height={900}
        src={"/Images/image1-dark.png"}
      ></img>
      {/* Mobile dark */}
      <img
        className="customShadowDark hidden w-[90vw] max-w-[300px] rounded-[12px] dark:block sm:hidden dark:sm:hidden"
        width={500}
        height={900}
        src={"/Images/image1-dark-mbl.png"}
      ></img>
    </div>
  );
}
