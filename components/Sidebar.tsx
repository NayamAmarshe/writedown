import {
  AiFillPlusCircle,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import { channelBackgroundColors } from "@/constants/channel-background-colors";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import ChannelCard from "./dashboard/sidebar/ChannelCard";
import { IChannelData } from "@/types/utils/operations";
import { collection, query } from "firebase/firestore";
import { createChannel } from "@/utils/operations";
import React, { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import EmojiSelector from "./EmojiSelector";
import { uuidv4 } from "@firebase/util";
import { db } from "@/lib/firebase";
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

  // const [channels] = useDocumentData(doc(db, "channels/" + userId), {
  //   initialValue: [],
  // });

  const [channels] = useCollectionData(
    user && query(collection(db, "users", user.uid, "channels"))
  );

  useEffect(() => {
    if (channels) {
      console.log("🚀 => file: Sidebar.tsx:60 => channels[0]", channels);
    }
  }, [channels]);

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

          createChannel(user?.uid, {
            name: channelName,
            emoji: selectEmoji.native,
            emojiBackground: channelBackgroundColors[emojiBackgroundIndex],
            id: uuidv4(),
            messages: [],
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
        <div className="flex h-full flex-col gap-5 overflow-auto p-2">
          {channels ? (
            channels.map((item) => {
              return <ChannelCard key={item.id} item={item as IChannelData} />;
            })
          ) : (
            <Skeleton count={5} height="50px" />
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
