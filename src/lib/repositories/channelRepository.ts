import type { IChannel, IResponseChannelJoin, IResponseChannelLeave, IResponseChannelList } from "$lib/types/IChannel";

export default {
  createChannel: async (name: string): Promise<IChannel> => {
    const response = await fetch("/api/channel/create", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ channelName: name }),
    });
    return await response.json();
  },
  getChannel: async (): Promise<IResponseChannelList> => {
    const response = await fetch("/api/channel/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const responseData: IResponseChannelList = await response.json();
    return await responseData;
  },
  deleteChannel: async (id: string) => {
    const response = await fetch("/api/channel/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    return await response.json();
  },
  joinChannel: async (id: string): Promise<IResponseChannelJoin> => {
    const response = await fetch("/api/channel/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    return await response.json();
  },
  leaveChannel: async (id: string): Promise<void> => {
    const response = await fetch("/api/channel/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    return await response.json();
  },
};
