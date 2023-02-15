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
        "my-5 h-fit w-fit self-center rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500"
      } ${
        messageData.type === "message" &&
        (messageData.text.length > 50
          ? "w-full items-center rounded-xl bg-gray-100"
          : "w-fit items-center rounded-xl bg-gray-100")
      }`}
    >
      {messageData.type === "message" && (
        <p className="my-2 mx-2 w-fit rounded-md bg-gray-200 py-1 px-2 text-xs font-medium text-gray-900">
          {messageData.createdAt?.toDate().toDateString()}
        </p>
      )}
      <p
        className={messageData.type === "message" ? "prose m-3 max-w-none" : ""}
        dangerouslySetInnerHTML={{ __html: messageData.text }}
      ></p>
    </div>
  );
};

export default ChatBubble;
