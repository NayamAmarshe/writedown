import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
export default function ShowcaseImages() {
  return (
    <div className="flex w-screen justify-center">
      <div className="max-screen-xl my-32 grid grid-rows-2 gap-24 px-0 sm:px-12">
        {/* Showcase Image 1 */}
        <div className="flex w-full flex-col-reverse items-center justify-center sm:flex-row">
          <div className="mt-7 flex flex-col gap-3 text-center sm:mt-7 sm:px-6 sm:text-start">
            <h3 className="text-h3">Easy to use, easy to write</h3>
            <p className="text-p">
              With writedown it becomes easier to jot down your thoughts quickly
              and in an efficient manner.
            </p>
            <div className="w-full">
              <Button variant="dark">Try it out!</Button>
            </div>
          </div>

          <div className="flex w-full justify-center sm:justify-end sm:pr-6">
            <img
              alt="an image"
              width={630}
              height={630}
              className="customShadow dark:customShadowDark w-[90vw]  max-w-[630px] rounded-[33px] sm:w-[50vw] xl:max-w-[550px]"
              src={"/Images/showcaseImg1.png"}
            ></img>
          </div>
        </div>
        {/* Showcase Image 2 */}
        <div className="flex w-full flex-col-reverse items-center justify-center sm:flex-row-reverse">
          <div className="mr-5 mt-7 flex flex-col gap-3 text-center sm:mt-0 sm:px-6  sm:text-start">
            <h3 className="text-h3">Easy to use, easy to write</h3>
            <p className="text-p">
              With writedown it becomes easier to jot down your thoughts quickly
              and in an efficient manner.
            </p>
            <div className="w-60">
              <Button variant="dark">Try it out!</Button>
            </div>
          </div>

          <div className="flex w-full justify-center sm:justify-start sm:pl-6">
            <img
              alt="an image"
              width={630}
              height={630}
              className="customShadow dark:customShadowDark w-[90vw] max-w-[630px] rounded-[33px] sm:w-[50vw] xl:max-w-[550px]"
              src={"/Images/showcaseImg1.png"}
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}
