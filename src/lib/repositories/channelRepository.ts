import type {
  IChannel,
  IResponseChannelHistory,
  IResponseChannelJoin,
  IResponseChannelLeave,
  IResponseChannelList, IResponseChannelSearch
} from "$lib/types/IChannel";
import type { IMessage, IRequestChannelHistoryBody } from "$lib/types/IMessage";

export default {
  createChannel: async (name: string): Promise<IChannel> => {
    const response = await fetch("/api/channel/create", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ channelName: name }),
    });
    if (!response.ok)
      throw new Error("channelRepository :: createChannel :: エラー");
    return await response.json();
  },
  getChannel: async (): Promise<IResponseChannelList> => {
    const response = await fetch("/api/channel/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const responseData: IResponseChannelList = await response.json();
    if (!response.ok)
      throw new Error("channelRepository :: getChannel :: エラー");
    return await responseData;
  },
  deleteChannel: async (id: string) => {
    const response = await fetch("/api/channel/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("channelRepository :: deleteChannel :: エラー");
    return await response.json();
  },
  updateChannel: async (dat: {
    channelId: string;
    name?: string;
    description?: string;
    isArchived?: boolean;
  }) => {
    const response = await fetch("/api/channel/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dat }),
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("channelRepository :: updateChannel :: エラー");
    return await response.json();
  },
  joinChannel: async (id: string): Promise<IResponseChannelJoin> => {
    const response = await fetch("/api/channel/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("channelRepository :: joinChannel :: エラー");
    return await response.json();
  },
  leaveChannel: async (id: string): Promise<IResponseChannelLeave> => {
    const response = await fetch("/api/channel/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("channelRepository :: leaveChannel :: エラー");
    return await response.json();
  },
  getHistory: async (
    channelId: string,
    requestBody: IRequestChannelHistoryBody,
  ): Promise<IResponseChannelHistory> => {
    const response = await fetch("/api/channel/get-history/" + channelId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });
    if (!response.ok)
      throw new Error("channelRepository :: getHistory :: エラー");
    return await response.json();
  },
  searchChannel: async(query: string): Promise<IResponseChannelSearch> => {
    const response = await fetch("/api/channel/search?query=" + query, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("channelRepository :: searchChannel :: エラー");
    return await response.json();
  }
};
