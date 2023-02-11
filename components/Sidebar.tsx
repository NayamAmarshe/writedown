import { AiFillPlusCircle, AiOutlineLogout, AiOutlineSetting } from "react-icons/ai";
import React, { useState } from "react";
import Modal from "./Modal";
import Input from "./Input";

const Sidebar = () => {
  const [channelName, setChannelName] = useState("");

  return (
    <div className="flex max-h-screen w-3/12 flex-col justify-between overflow-hidden bg-gray-100 p-4">
      <Modal id="add-new-channel">
        <Input
          id="channel-name"
          label="Channel Name"
          type="text"
          value={channelName}
          placeholder="Enter Channel Name"
          onChange={(e) => {
            setChannelName(e.target.value);
          }}
        />
      </Modal>
      {/* TOP BAR */}
      <div className="flex w-full flex-row items-center justify-between">
        {/* LOGO */}
        <h4 className="flex flex-row items-center gap-2 text-xl font-semibold">
          <img src="/logo.svg" alt="Logo" className="w-8" />
          WriteDown
        </h4>
      </div>

      {/* CHANNELS SECTION */}
      <div className="flex h-2 basis-full flex-col gap-3 p-3">
        {/* CHANNELS HEADING */}
        <h4 className="mt-4 text-sm font-medium text-gray-600">CHANNELS</h4>
        {/* NEW CHANNEL BUTTON */}
        <button
          className="flex w-full flex-row items-center justify-center gap-2 rounded-full bg-gray-200 p-2"
          data-hs-overlay="#add-new-channel"
        >
          <AiFillPlusCircle className="text-xl" />
          New Channel
        </button>

        {/* CHANNEL LIST */}
        <div className="flex flex-col gap-5 overflow-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item, index) => {
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

      {/* BOTTOM BAR */}
      <div className="flex w-full flex-row justify-around p-5">
        <AiOutlineSetting className="text-2xl" />
        <AiOutlineLogout className="text-2xl" />
      </div>
    </div>
  );
};

export default Sidebar;
