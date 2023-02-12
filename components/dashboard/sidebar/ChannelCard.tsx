import { IChannelData } from "@/types/utils/firebase-operations";
import React from "react";

const ChannelCard = ({ item }: { item: IChannelData }) => {
  return (
    <div
      key={item.id}
      className="flex flex-row items-center justify-center gap-5"
    >
      {/* CHANNEL PIC */}
      <div
        className={
          "flex h-12 w-12 shrink-0 grow-0 items-center justify-center rounded-full bg-gradient-to-b text-xl " +
          item.emojiBackground
        }
      >
        {item.emoji}
      </div>
      {/* CHANNEL INFO */}
      <div className="flex w-full flex-col">
        {/* CHANNEL HEADING */}
        <div className="flex w-full flex-row justify-between">
          {/* CHANNEL NAME */}
          <h4 className="font-medium text-gray-700">{item.name}</h4>
          {/* CHANNEL TIME */}
          <h4 className="text-xs text-gray-400">{"9:43 PM"}</h4>
        </div>
        {/* CHANNEL CHAT */}
        <p className="text-sm text-gray-400">
          {"Lorem ipsum dolor sit amet..."}
        </p>
      </div>
    </div>
  );
};

export default ChannelCard;
