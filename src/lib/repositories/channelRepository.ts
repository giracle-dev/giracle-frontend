import { PUBLIC_BACKEND_ADDRESS } from "$env/static/public";
import type { IChannel, IResponseChannel } from "$lib/types/IChannel";

export default {
  createChannel: async (name: string): Promise<IChannel> => {
    const response = await fetch(`${PUBLIC_BACKEND_ADDRESS}/channel/create`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ channelName: name }),
    });
    return await response.json();
  },
  getChannel: async (): Promise<IResponseChannel> => {
    const response = await fetch(`${PUBLIC_BACKEND_ADDRESS}/channel/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const responseData: IResponseChannel = await response.json();
    return await responseData;
  },
  deleteChannel: async (id: string): Promise<void> => {
    const response = await fetch(`${PUBLIC_BACKEND_ADDRESS}/channel/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    return await response.json();
  },
  joinChannel: async (id: string): Promise<void> => {
    const response = await fetch(`${PUBLIC_BACKEND_ADDRESS}/channel/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    return await response.json();
  },
  leaveChannel: async (id: string): Promise<void> => {
    const response = await fetch(`${PUBLIC_BACKEND_ADDRESS}/channel/leave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
      credentials: "include",
    });
    return await response.json();
  },
};
