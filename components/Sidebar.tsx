import {
  AiFillPlusCircle,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import { channelBackgroundColors } from "@/constants/channel-background-colors";
import { selectedChannelIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { IChannelData } from "@/types/utils/firebaseOperations";
import { createChannel } from "@/utils/firebaseOperations";
import ChannelCard from "./dashboard/sidebar/ChannelCard";
import { collection, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import EmojiSelector from "./EmojiSelector";
import { uuidv4 } from "@firebase/util";
import { db } from "@/lib/firebase";
import { useAtom } from "jotai";
import Modal from "./Modal";
import Input from "./Input";

interface SidebarProps {
  id: string;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ user }: SidebarProps & IFirebaseAuth) => {
  const [channelName, setChannelName] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState({
    native: "🙂",
  });
  const [emojiBackgroundIndex, setEmojiBackgroundIndex] = useState(0);

  const [selectedChannelId, setSelectedChannelId] = useAtom(
    selectedChannelIdAtom
  );

  const [channels] = useCollectionData(
    user && query(collection(db, "users", user.uid, "channels"))
  );

  const [messages] = useCollectionData(
    user && query(collection(db, "messages"))
  );

  useEffect(() => {
    if (channels && channels.length > 0) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, messages]);

  useEffect(() => {
    console.log("Sidebar -> selectedChannelId: ", selectedChannelId);
  }, [selectedChannelId]);

  const resetAddChannelForm = () => {
    setChannelName("");
    setSelectEmoji({
      native: "🙂",
    });
    setEmojiBackgroundIndex(0);
  };

  return (
    <div className="flex max-h-screen flex-col justify-between overflow-hidden bg-gray-100 p-4 md:w-6/12 lg:w-4/12">
      <Modal
        id="add-new-channel"
        saveHandler={() => {
          if (!user) return;

          createChannel(user.uid, {
            name: channelName,
            emoji: selectEmoji.native,
            emojiBackground: channelBackgroundColors[emojiBackgroundIndex],
            id: uuidv4(),
            messages: [],
            userId: user.uid,
          });
          resetAddChannelForm();
        }}
      >
        <div className="flex flex-col gap-5">
          <EmojiSelector
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            selectEmoji={selectEmoji}
            setSelectEmoji={setSelectEmoji}
            emojiBackgroundIndex={emojiBackgroundIndex}
            setEmojiBackgroundIndex={setEmojiBackgroundIndex}
          />
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
        </div>
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
        <div className="flex h-full flex-col gap-5 overflow-auto">
          {channels ? (
            channels.map((item, index) => {
              return (
                <ChannelCard
                  key={item.id}
                  highlight={selectedChannelId === item.id}
                  channel={item as IChannelData}
                  onClick={() => {
                    setSelectedChannelId(item.id);
                  }}
                />
              );
            })
          ) : (
            <Skeleton count={5} height="50px" />
          )}
          {channels && channels.length === 0 && (
            <p className="text-center text-gray-500">
              No Channels to show. Start by creating one 🤓
            </p>
          )}
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
