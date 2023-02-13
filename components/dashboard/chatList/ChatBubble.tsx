import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import React from "react";

interface ChatBubbleProps {
  messageData: IMessageData;
  channelData?: IChannelData;
}

const ChatBubble = ({ messageData, channelData }: ChatBubbleProps) => {
  return (
    <div
      key={messageData.id}
      className={`${
        messageData.type === "info" &&
        "my-5 h-fit w-fit self-center rounded-full bg-gray-300 p-2 text-sm text-gray-600"
      } ${
        messageData.type === "message" &&
        "h-fit w-fit items-center rounded-full bg-purple-100 py-1.5 px-3 font-medium text-gray-800"
      }`}
    >
      <p className="">
        {messageData.text}{" "}
        {messageData.type === "message" && (
          <span className="text-xs text-gray-500">
            {messageData.createdAt?.toDate().toDateString()}
          </span>
        )}
      </p>
    </div>
  );
};

export default ChatBubble;
