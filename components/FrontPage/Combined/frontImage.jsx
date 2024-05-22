import React from "react";
import Image from "next/image";

export default function FrontImage() {
  return (
    <div className="flex w-full flex-col items-center gap-12">
      {/* Desktop light */}
      <img
        alt="an image"
        className="hidden w-[85vw] max-w-5xl sm:block dark:sm:hidden"
        width={1200}
        height={900}
        src={"/Images/image1.png"}
      ></img>
      {/* Mobile light */}
      <img
        alt="an image"
        className="customShadow block w-[90vw] max-w-xs rounded-2xl dark:hidden sm:hidden dark:sm:hidden"
        width={500}
        height={900}
        src={"/Images/image1-mbl.png"}
      ></img>
      {/* Desktop dark */}
      <img
        alt="an image"
        className="hidden w-[80vw] max-w-5xl  dark:sm:block "
        width={1200}
        height={900}
        src={"/Images/image1-dark.png"}
      ></img>
      {/* Mobile dark */}
      <img
        alt="an image"
        className="customShadowDark hidden w-[90vw] max-w-xs rounded-2xl dark:block sm:hidden dark:sm:hidden"
        width={500}
        height={900}
        src={"/Images/image1-dark-mbl.png"}
      ></img>
    </div>
  );
}
