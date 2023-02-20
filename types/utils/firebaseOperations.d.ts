import { FieldValue, Timestamp } from "firebase/firestore";

export interface IChannelData {
  id: string;
  userId: string;
  createdAt?: FieldValue;
  name: string;
  emoji: string;
  emojiBackground: string;
  messages: IMessageData[];
  type: "private" | "public";
  slug: string;
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
