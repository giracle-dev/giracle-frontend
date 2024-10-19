export interface IMessage {
  channelId: string;
  content: string;
  createdAt: Date;
  id: string;
  isSystemMessage: false;
  userId: string;
}

export interface IRequestChannelHistoryBody {
  messageIdFrom?: string;
  messageTimeFrom?: Date;
  fetchLength?: number;
  fetchDirection?: "older" | "newer";
}
