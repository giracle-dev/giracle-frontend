import type { IChannel } from "./IChannel";

export interface IMessage {
  channelId: string;
  content: string;
  createdAt: Date;
  id: string;
  isSystemMessage: false;
  userId: string;
  MessageUrlPreview: IMessageUrlPreview[];
  MessageFileAttached: IMessageFileAttached[]
}

export interface IInbox {
  type: "event" | "mention" | "reply";
  userId: string;
  messageId: string;
  Message: IMessage;
  happendAt: Date;
}

export interface IMessageUrlPreview {
  description: string;
  faviconLink: string;
  id: number;
  imageLink: string;
  title: string;
  type: "article" | "video.other" | "UNKNOWN";
  url: string;
}

export interface IMessageFileAttached {
  id: string;
  userId: string;
  channelId: string;
  messageId: string | null;
  actualFileName: string;
  savedFileName: string;
  size: number;
  type: File["type"];
}

export interface IRequestChannelHistoryBody {
  messageIdFrom?: string;
  messageTimeFrom?: Date;
  fetchLength?: number;
  fetchDirection?: "older" | "newer";
}

export interface IResponseHasNewMessage {
  message: "Fetched news",
  data: {
    [key: IChannel["id"]]: boolean;
  }
}

export interface IResponseGetReadTime {
  message: "Fetched read time",
  data: {
    channelId: string,
    userId: string,
    readTime: Date
  }[]
}

export interface IResponseGetInbox {
  message: "Fetched inbox",
  data: IInbox[]
}

export interface IResponseSearchMessage {
  message: "Searched messages",
  data: IMessage[]
}
