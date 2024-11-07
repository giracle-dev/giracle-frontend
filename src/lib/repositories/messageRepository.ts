import type { IResponseGetInbox, IResponseGetReadTime, IResponseHasNewMessage, IResponseSearchMessage } from "$lib/types/IMessage";

export default {
  sendMessage: async (channelId: string, message: string, fileIds: string[]): Promise<void> => {
    const response = await fetch("/api/message/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ channelId, message, fileIds }),
    });
    if (!response.ok)
      throw new Error("messageRepository :: sendMessage : エラー");
    return await response.json();
  },
  deleteMessage: async (messageId: string): Promise<void> => {
    const response = await fetch("/api/message/delete", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({ messageId }),
    });
    if (!response.ok)
      throw new Error("messageRepository :: deleteMessage : エラー");
    return await response.json();
  },
  getInbox: async (): Promise<IResponseGetInbox> => {
    const response = await fetch("/api/message/inbox", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("messageRepository :: getInbox : エラー");
    return await response.json();
  },
  getReadTime: async (): Promise<IResponseGetReadTime> => {
    const response = await fetch("/api/message/read-time/get", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("messageRepository :: getReadTime : エラー");
    return await response.json();
  },
  updateReadTime: async (channelId: string, readTime: Date): Promise<void> => {
    const response = await fetch("/api/message/read-time/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ channelId, readTime }),
    });
    if (!response.ok)
      throw new Error("messageRepository :: updateReadTime : エラー");
    return await response.json();
  },
  getHasNewMessage: async (): Promise<IResponseHasNewMessage> => {
    const response = await fetch("/api/message/get-new", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("messageRepository :: getHasNewMessage : エラー");
    return await response.json();
  },
  searchMessage: async (
    _dat: {
      channelId?: string,
      content?: string,
      userId?: string,
      hasUrlPreview?: boolean
      hasFileAttachment?: boolean,
      loadIndex: number,
      dateOrder: "asc" | "desc"
    }
  ): Promise<IResponseSearchMessage> => {
    let uri = `/api/message/search?`;
    if (_dat.channelId) uri += "&channelId=" + _dat.channelId;
    if (_dat.content) uri += "&content=" + _dat.content;
    if (_dat.userId) uri += "&userId=" + _dat.userId;
    if (_dat.hasUrlPreview !== undefined) uri += "&hasUrlPreview=" + _dat.hasUrlPreview;
    if (_dat.hasFileAttachment !== undefined) uri += "&hasFileAttachment=" + _dat.hasFileAttachment;
    uri += "&loadIndex=" + _dat.loadIndex;
    uri += "&sort=" + _dat.dateOrder;
    const response = await fetch(uri, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("messageRepository :: searchMessage : エラー");
    return await response.json();
  }
};
