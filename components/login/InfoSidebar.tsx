import React from "react";
const InfoSidebar = () => {
  return (
    <div className="relative hidden h-full w-1/2 flex-col gap-2 overflow-hidden bg-slate-300 md:flex">
      <h1 className="mt-52 ml-20 text-2xl font-semibold">
        Simplicity starts here
      </h1>
      <p className="ml-20 w-1/2 text-slate-700">
        A fast, easy and free way to write notes with offline support, cloud
        sync and real-time markdown preview.
      </p>
      <img
        src="/writedown.png"
        alt="Writedown Screenshot"
        className="absolute left-1/3 bottom-0 scale-150 rounded-xl shadow-lg shadow-slate-900/30"
      />
    </div>
  );
};

export default InfoSidebar;
//  <div className="hidden h-full w-1/2 flex-col gap-2 bg-slate-200 md:flex"></div>
