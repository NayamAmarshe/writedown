import React from "react";

const Features = () => {
  return (
    <div className="mb-10 grid grid-flow-col gap-10 px-36">
      <div className="flex cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-110 hover:bg-sky-100">
        <h6 className="text-lg font-medium">Free and Open Source</h6>
        <p>
          Writedown is completely free and open source and licensed under AGPLv3
        </p>
      </div>
      <div className="flex cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-110 hover:bg-emerald-100">
        <h6 className="text-lg font-medium">Synced on all your devices</h6>
        <p>
          All your notes are synced on all your devices. You can access them
          from anywhere.
        </p>
      </div>
      <div className="flex cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-110 hover:bg-rose-100">
        <h6 className="text-lg font-medium">Live Markdown</h6>
        <p>
          Writedown supports Markdown. You can write markdown and preview it in
          real-time.
        </p>
      </div>
      <div className="flex cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 transition-all duration-300 hover:scale-110 hover:bg-yellow-100">
        <h6 className="text-lg font-medium">Easy to Use</h6>
        <p>
          Writedown is easy to use with a beautiful interface. Get started in
          just 5 seconds!
        </p>
      </div>
    </div>
  );
};

export default Features;
