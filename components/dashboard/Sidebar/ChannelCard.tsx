import { getMessagesByChannelId } from "@/utils/firebaseOperations";
import { IChannelData } from "@/types/utils/firebaseOperations";
import React, { HTMLAttributes, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const ChannelCard = ({
  channel,
  highlight,
  ...rest
}: {
  channel: IChannelData;
  highlight: boolean;
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      key={channel.id}
      className={`flex cursor-pointer flex-row items-center justify-center gap-5 p-2 ${
        highlight && "rounded-full bg-gray-300"
      }`}
      {...rest}
    >
      {/* CHANNEL PIC */}
      <div
        className={
          " flex h-12 w-12 shrink-0 grow-0 items-center justify-center rounded-full bg-gradient-to-b text-xl " +
          channel.emojiBackground
        }
      >
        {channel.emoji || <Skeleton />}
      </div>
      {/* CHANNEL INFO */}
      <div className="hidden w-full lg:flex lg:flex-col">
        {/* CHANNEL HEADING */}
        <div className="flex w-full flex-row justify-between">
          {/* CHANNEL NAME */}
          <h4 className="font-medium text-gray-700">
            {channel.name || <Skeleton />}
          </h4>
          {/* CHANNEL TIME */}
          <h4 className="text-xs text-gray-400">{<Skeleton />}</h4>
        </div>
        {/* CHANNEL CHAT */}
        <p className="text-sm text-gray-400">{"HHEHE" || <Skeleton />}</p>
      </div>
    </div>
  );
};

export default ChannelCard;
