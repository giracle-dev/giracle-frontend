import type { IResponseHasNewMessage } from "$lib/types/IMessage";

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
  deleteMessage: async (messageId: string): Promise<void> =>{
    const response = await fetch("/api/message/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ messageId }),
    });
    console.log(response);
    if(!response.ok)
      throw new Error("messageRepository :: deleteMessage : エラー");
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
  }
};
