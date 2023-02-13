import { FieldValue, Timestamp } from "firebase/firestore";

export interface IChannelData {
  id: string;
  userId: string;
  createdAt?: FieldValue;
  name: string;
  emoji: string;
  emojiBackground: string;
  messages: IMessageData[];
}

export interface IMessageData {
  id: string;
  createdAt?: Timestamp;
  text: string;
  type: "info" | "message";
  channelId: string;
}
