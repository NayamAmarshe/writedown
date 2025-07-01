import darkLoadingAnimation from "@/lottie/pencil-write-dark.json";
import loadingAnimation from "@/lottie/pencil-write.json";
import { FEATURE_FLAGS } from "@/constants/feature-flags";
import BetaBadge from "./ui/BetaBadge";
import Lottie from "lottie-react";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 z-99 flex h-screen w-screen flex-col overflow-y-auto bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Lottie
          className="max-h-96 dark:hidden"
          animationData={loadingAnimation}
          loop={true}
        />
        <Lottie
          className="hidden max-h-96 dark:block"
          animationData={darkLoadingAnimation}
          loop={true}
        />
        <p className="flex items-center text-2xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">
          writedown {FEATURE_FLAGS.beta && <BetaBadge />}
        </p>
      </div>
    </div>
  );
};

export default Loading;
