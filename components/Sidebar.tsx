import React from "react";

const Sidebar = () => {
  return (
    <div className="min-h-full w-3/12 bg-gray-100 p-4">
      {/* LOGO */}
      <h4 className="flex flex-row items-center gap-2 text-xl font-semibold">
        <img src="/logo.svg" alt="Logo" className="w-8" />
        WriteDown
      </h4>

      <div className="flex flex-col gap-3 p-3">
        <h4 className="mt-4 text-sm font-medium text-gray-600">CHANNELS</h4>
        <div>
          {/* CHANNEL LIST */}
          <div className="mt-2 flex flex-col gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
              {
                /* CHANNEL */
              }
              return (
                <div key={index} className="flex flex-row items-center justify-center gap-5">
                  {/* CHANNEL PIC */}
                  <div className="rounded-full bg-gray-300 p-5"></div>
                  {/* CHANNEL INFO */}
                  <div className="flex w-full flex-col">
                    {/* CHANNEL HEADING */}
                    <div className="flex w-full flex-row justify-between">
                      {/* CHANNEL NAME */}
                      <h4 className="font-medium text-gray-700">General</h4>
                      {/* CHANNEL TIME */}
                      <h4 className="text-xs text-gray-400">9:43 PM</h4>
                    </div>
                    {/* CHANNEL CHAT */}
                    <p className="text-sm text-gray-400">Lorem ipsum dolor sit amet...</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
