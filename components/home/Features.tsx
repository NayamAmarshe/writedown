import {
  Baby,
  Eye,
  Flower,
  Package,
  PackageOpen,
  RefreshCcw,
  WifiOff,
} from "lucide-react";
import React from "react";

const Features = () => {
  return (
    <div className="mb-10 grid grid-cols-1 content-center gap-4 px-4 sm:grid-cols-2 sm:gap-8 sm:px-5 md:px-20 lg:grid-cols-2 lg:px-36 xl:grid-cols-5">
      <div className="flex w-full cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-105 hover:bg-sky-100 sm:hover:scale-110">
        <h6 className="flex flex-col items-center gap-1 text-lg font-medium text-slate-900">
          <PackageOpen /> Free and Open Source
        </h6>
        <p className="text-slate-600">
          Writedown is completely free and open source and licensed under AGPLv3
        </p>
      </div>

      <div className="flex cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-105 hover:bg-emerald-100 sm:hover:scale-110">
        <h6 className="flex flex-col items-center gap-1 text-lg font-medium text-slate-900">
          <RefreshCcw />
          Synced on all your devices
        </h6>
        <p className="text-slate-600">
          All your notes are synced on all your devices. You can access them
          from anywhere.
        </p>
      </div>

      <div className="flex cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-105 hover:bg-violet-100 sm:hover:scale-110">
        <h6 className="flex flex-col items-center gap-1 text-lg font-medium text-slate-900">
          <WifiOff />
          Offline Support
        </h6>
        <p className="text-slate-600">
          Write and save notes even when you are away from the internet!
        </p>
      </div>

      <div className="flex cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-105 hover:bg-rose-100 sm:hover:scale-110">
        <h6 className="flex flex-col items-center gap-1 text-lg font-medium text-slate-900">
          <Eye />
          Live Markdown
        </h6>
        <p className="text-slate-600">
          Writedown supports Markdown. You can write markdown and preview it in
          real-time.
        </p>
      </div>

      <div className="flex cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-105 hover:bg-yellow-100 sm:hover:scale-110">
        <h6 className="flex flex-col items-center gap-1 text-lg font-medium text-slate-900">
          <Flower />
          Easy to Use
        </h6>
        <p className="text-slate-600">
          Writedown is easy to use with a beautiful interface. Get started in
          just 5 seconds!
        </p>
      </div>
    </div>
  );
};

export default Features;
