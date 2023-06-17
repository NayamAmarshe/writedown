import React from "react";
const InfoSidebar = () => {
  return (
    <div className="relative h-1/2 w-full flex-col gap-2 overflow-hidden bg-slate-300 dark:bg-slate-600 md:h-full md:w-2/3">
      <h1 className="ml-10 mt-20 text-lg font-semibold dark:text-slate-50 md:ml-20 md:mt-52 md:text-2xl">
        Simplicity starts here
      </h1>
      <p className="ml-10 w-9/12 text-slate-700 dark:text-slate-200 sm:w-6/12 md:ml-20 md:w-1/2">
        A fast, easy and free way to write notes with offline support, cloud
        sync and real-time markdown preview.
      </p>

      <img
        src="/writedown.png"
        alt="Writedown Screenshot"
        className="ml-10 mt-5 h-96 origin-top-left rounded-l-xl object-cover object-left-top shadow-lg shadow-slate-900/50 dark:hidden dark:shadow-black/30 md:ml-20 md:mt-10 md:h-[70vh]"
      />
      <img
        src="/writedown-dark.png"
        alt="Writedown Screenshot"
        className="ml-10 mt-5 hidden h-96 origin-top-left rounded-l-xl object-cover object-left-top shadow-lg shadow-slate-900/50 dark:block dark:shadow-black/30 md:ml-20 md:mt-10 md:h-[70vh]"
      />
    </div>
  );
};

export default InfoSidebar;
