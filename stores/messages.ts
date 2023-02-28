import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { atom } from "jotai";

export const messagesAtom = atom<
  {
    channel: IChannelData;
    messages: IMessageData[];
  }[]
>([]);
