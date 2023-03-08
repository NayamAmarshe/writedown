import { Timestamp } from "firebase/firestore";

export interface IChannelData {
  id: string;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  name: string;
  emoji: string;
  emojiBackground: string;
  messages: IMessageData[];
  type: "private" | "public";
  slug: string;
}

export interface IChannelEditData {
  name: string;
  emoji: string;
  emojiBackground: string;
  type?: "private" | "public";
}

export interface IChatLinkData {
  userId: string;
  channelId: string;
}

export interface IMessageData {
  id: string;
  createdAt?: Timestamp;
  updated: boolean;
  text: string;
  type: "info" | "message";
  channelId: string;
  userId: string;
  type: "info" | "message";
  slug: string;
}
