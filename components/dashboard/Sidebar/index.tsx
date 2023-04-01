import {
  AiFillPlusCircle,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import { channelBackgroundColors } from "@/constants/channel-background-colors";
import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { selectedChannelIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IFirebaseAuth } from "@/types/components/firebase-hooks";
import { collection, orderBy, query } from "firebase/firestore";
import { createChannel } from "@/utils/firebaseOperations";
import EmojiSelector from "@/components/ui/EmojiSelector";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { memo, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import { uuidv4 } from "@firebase/util";
import ChannelCard from "./ChannelCard";
import { db } from "@/lib/firebase";
import { auth } from "@/pages/_app";
import { nanoid } from "nanoid";
import { useAtom } from "jotai";

interface SidebarProps {
  id: string;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  channels?: IChannelData[];
  messages?: IMessageData[];
}

const Sidebar = ({
  user,
  channels,
  messages,
}: SidebarProps & IFirebaseAuth) => {
  const [channelName, setChannelName] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState({
    native: "🙂",
  });
  const [emojiBackgroundIndex, setEmojiBackgroundIndex] = useState(0);

  const [selectedChannelId, setSelectedChannelId] = useAtom(
    selectedChannelIdAtom
  );

  useEffect(() => {
    if (channels && channels.length > 0) {
      setSelectedChannelId(channels[0].id);
    }
    console.log(messages);
  }, [channels, messages]);

  const resetAddChannelForm = () => {
    setChannelName("");
    setSelectEmoji({
      native: "🙂",
    });
    setEmojiBackgroundIndex(0);
  };

  const saveChannelHandler = async () => {
    if (channelName.length === 0) {
      toast.error("Please enter a channel name");
      return;
    }

    if (!user) return;

    createChannel(user.uid, {
      name: channelName,
      emoji: selectEmoji.native,
      emojiBackground: channelBackgroundColors[emojiBackgroundIndex],
      id: uuidv4(),
      messages: [],
      userId: user.uid,
      slug: nanoid(),
      type: "private",
    });
    resetAddChannelForm();
  };

  const newPostClickHandler = () => {};

  return (
    <aside className="m-10 flex w-96 flex-col gap-5 rounded-xl bg-white p-4">
      {user ? (
        <h4 className="text-xl font-semibold text-slate-500">
          Hi there, <span className="text-slate-900">{user?.displayName}</span>
        </h4>
      ) : (
        <Skeleton className="h-6 w-2/3" />
      )}

      <Button onClick={newPostClickHandler}>Create New Post</Button>

      <div className="flex flex-col gap-3">
        <h6 className="font-semibold">Posts</h6>
        <div className="flex flex-col gap-2">
          {/* {notes?.map((note) => (
              <div key={note.id}>{note.title}</div>
            ))} */}
          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
            <h6 className="font-medium">My first post 🚀</h6>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
                possimus...
              </p>
              <div className="flex flex-row flex-wrap gap-1">
                <Badge color="yellow">UI</Badge>
                <Badge color="green">Development</Badge>
                <Badge color="red">UX</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border-2 border-slate-300 bg-slate-200 p-4">
            <h6 className="font-medium">My first post 🚀</h6>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
                possimus...
              </p>
              <div className="flex flex-row flex-wrap gap-1">
                <Badge color="yellow">UI</Badge>
                <Badge color="green">Development</Badge>
                <Badge color="red">UX</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
            <h6 className="font-medium">My first post 🚀</h6>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
                possimus...
              </p>
              <div className="flex flex-row flex-wrap gap-1">
                <Badge color="yellow">UI</Badge>
                <Badge color="green">Development</Badge>
                <Badge color="red">UX</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
            <h6 className="font-medium">My first post 🚀</h6>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
                possimus...
              </p>
              <div className="flex flex-row flex-wrap gap-1">
                <Badge color="yellow">UI</Badge>
                <Badge color="green">Development</Badge>
                <Badge color="red">UX</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
