import loadingAnimation from "@/animations/pencil-write.json";
import Lottie from "lottie-react";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 z-[99] flex h-screen w-screen flex-col overflow-y-auto bg-slate-50 text-slate-900">
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Lottie
          className="max-h-96"
          animationData={loadingAnimation}
          loop={true}
        />
        <p className="text-2xl font-semibold text-slate-900 sm:text-4xl">
          writedown
        </p>
      </div>
    </div>
  );
};

export default Loading;
