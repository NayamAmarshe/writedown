import React from "react";
import Image from "next/image";
import TBox from "../textbox";
import Btn from "../button";

export default function ShowcaseImages() {
  return (
    <div className="flex w-screen justify-center">
      <div className="my-32 grid max-w-[1200px] grid-rows-2 gap-24">
        {/* Showcase Image 1 */}
        <div className="flex w-full flex-col-reverse items-center justify-center sm:flex-row">
          <div className="mt-7 flex flex-col gap-3 text-center sm:mt-7 sm:px-6 sm:text-start">
            {" "}
            <TBox variant="h3">Easy to use, easy to write</TBox>
            <TBox variant="p">
              With writedown it becomes easier to jot down your thoughts quickly
              and in an efficient manner.
            </TBox>
            <Btn variant="page">Try it out!</Btn>
          </div>

          <div className="flex w-full justify-center sm:justify-end sm:pr-6">
            <Image
              width={630}
              height={630}
              className="customShadow dark:customShadowDark w-[90vw]  max-w-[630px] rounded-[33px] sm:w-[50vw] xl:max-w-[550px]"
              src={"/Images/showcaseImg1.png"}
            ></Image>
          </div>
        </div>
        {/* Showcase Image 2 */}
        <div className="flex w-full flex-col-reverse items-center justify-center sm:flex-row-reverse">
          <div className="mr-5 mt-7 flex flex-col gap-3 text-center sm:mt-0 sm:px-6  sm:text-start">
            {" "}
            <TBox variant="h3">Easy to use, easy to write</TBox>
            <TBox variant="p">
              With writedown it becomes easier to jot down your thoughts quickly
              and in an efficient manner.
            </TBox>
            <Btn variant="page">Try it out!</Btn>
          </div>

          <div className="flex w-full justify-center sm:justify-start sm:pl-6">
            <Image
              width={630}
              height={630}
              className="customShadow dark:customShadowDark w-[90vw] max-w-[630px] rounded-[33px] sm:w-[50vw] xl:max-w-[550px]"
              src={"/Images/showcaseImg1.png"}
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
}
