import { getMessagesByChannelId } from "@/utils/firebaseOperations";
import { IChannelData } from "@/types/utils/firebaseOperations";
import Skeleton from "react-loading-skeleton";
import React, { useEffect } from "react";

const ChannelCard = ({ channel }: { channel: IChannelData }) => {
  const [message, setMessage] = React.useState("");
  useEffect(() => {
    getMessagesByChannelId(channel.id, channel.userId).then((data) => {
      if (data && data[0]) {
        setMessage(data[0].data().text);
      }
    });
  }, [channel.id, channel.userId]);

  return (
    <div
      key={channel.id}
      className="flex flex-row items-center justify-center gap-5"
    >
      {/* CHANNEL PIC */}
      <div
        className={
          "flex h-12 w-12 shrink-0 grow-0 items-center justify-center rounded-full bg-gradient-to-b text-xl " +
          channel.emojiBackground
        }
      >
        {channel.emoji}
      </div>
      {/* CHANNEL INFO */}
      <div className="flex w-full flex-col">
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
        <p className="text-sm text-gray-400">{message || <Skeleton />}</p>
      </div>
    </div>
  );
};

export default ChannelCard;
