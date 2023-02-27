import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import React, { memo, useState } from "react";
import { User } from "firebase/auth";
import ChatList from "./ChatList";
import Sidebar from "./Sidebar";

interface ChatScreenProps {
  user?: User | null;
  channels?: IChannelData[];
  messages?: IMessageData[];
}

const ChatScreen = ({ user, channels, messages }: ChatScreenProps) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div className="lg:w-96">
        <Sidebar
          id="sidebar"
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          user={user}
          channels={channels}
          messages={messages}
        />
      </div>
      <ChatList user={user} />
    </>
  );
};

export default memo(ChatScreen);
