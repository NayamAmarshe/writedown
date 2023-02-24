import { IChannelData } from "@/types/utils/firebaseOperations";
import Skeleton from "react-loading-skeleton";
import React from "react";

const ChannelDetailsBar = ({ channel }: { channel: IChannelData }) => {
  return (
    <div className="fixed z-10 flex h-16 w-full cursor-pointer items-center bg-gray-300 bg-opacity-60 px-2 backdrop-blur-lg">
      <div className="flex items-center gap-2">
        {/* CHANNEL PIC */}
        <div
          className={
            " flex h-10 w-10 shrink-0 grow-0 items-center justify-center rounded-full bg-gradient-to-b text-xl " +
            channel.emojiBackground
          }
        >
          {channel.emoji || <Skeleton />}
        </div>
        <div>
          <p className="text-xl font-medium text-gray-700">{channel.name}</p>
          <p className="text-sm text-gray-500">
            Created {channel.createdAt?.toDate().toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailsBar;
