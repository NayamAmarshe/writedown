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
import { collection, query } from "firebase/firestore";
import EmojiSelector from "../../ui/EmojiSelector";
import React, { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { uuidv4 } from "@firebase/util";
import ChannelCard from "./ChannelCard";
import { db } from "@/lib/firebase";
import Modal from "../../ui/Modal";
import Input from "../../ui/Input";
import { useAtom } from "jotai";

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
    <div className="flex h-full flex-col justify-between overflow-hidden bg-gray-100 py-4">
      <Modal
        title="Add New Channel"
        saveButtonLabel="Add"
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
      <div className="flex w-full flex-row items-center justify-center px-2 lg:justify-between">
        {/* LOGO */}
        <h4 className="flex flex-row items-center gap-2  pb-4 text-xl font-semibold lg:border-none lg:pb-0">
          <img src="/logo.svg" alt="Logo" className="w-12 lg:w-8" />
          <span className="hidden lg:block">WriteDown</span>
        </h4>
      </div>

      {/* CHANNELS SECTION */}
      <div className="flex h-2 basis-full flex-col gap-3 p-3">
        {/* CHANNELS HEADING */}
        <h4 className="mt-4 hidden text-sm font-medium text-gray-600 lg:block">
          CHANNELS
        </h4>
        {/* NEW CHANNEL BUTTON */}
        <button
          className="flex h-16 w-full flex-row items-center justify-center gap-2 rounded-full bg-gray-200 p-2 lg:h-auto"
          data-hs-overlay="#add-new-channel"
        >
          <AiFillPlusCircle className="text-xl" />
          <span className="hidden lg:block">New Channel</span>
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
      <div className="gap- flex w-full flex-col items-center justify-around gap-6 p-5 lg:flex-row lg:gap-0">
        <AiOutlineSetting className="text-2xl" />
        <AiOutlineLogout className="text-2xl" />
      </div>
    </div>
  );
};

export default Sidebar;
