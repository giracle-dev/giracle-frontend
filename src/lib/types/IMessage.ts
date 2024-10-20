export interface IMessage {
  channelId: string;
  content: string;
  createdAt: Date;
  id: string;
  isSystemMessage: false;
  userId: string;
  MessageUrlPreview: IMessageUrlPreview[];
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

export interface IRequestChannelHistoryBody {
  messageIdFrom?: string;
  messageTimeFrom?: Date;
  fetchLength?: number;
  fetchDirection?: "older" | "newer";
}
