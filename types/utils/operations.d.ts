export interface IChannelData {
  id: string;
  createdAt?: string;
  name: string;
  emoji: string;
  emojiBackground: string;
  messages: IMessageData[];
}

export interface IMessageData {
  id: string;
  createdAt?: string;
  text: string;
}
