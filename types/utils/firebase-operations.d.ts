import { FieldValue } from "firebase/firestore";

export interface IChannelData {
  id: string;
  createdAt?: FieldValue;
  name: string;
  emoji: string;
  emojiBackground: string;
  messages: IMessageData[];
}

export interface IMessageData {
  id: string;
  createdAt?: FieldValue;
  text: string;
  type: string;
}
