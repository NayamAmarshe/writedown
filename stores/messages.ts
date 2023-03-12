import { IChannelData, IMessageData } from "@/types/utils/firebaseOperations";
import { atom } from "jotai";

export const messagesAtom = atom<{
  [channelId: string]: IMessageData[];
}>({});
