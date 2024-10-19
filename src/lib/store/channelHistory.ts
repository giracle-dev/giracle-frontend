import type { IChannel, IChannelHistory } from "$lib/types/IChannel";
import type { IMessage } from "$lib/types/IMessage";
import { writable } from "svelte/store";

const initialChannelHistory: IChannelHistory = {
  history: [],
  atTop: false,
  atEnd: false,
};

export const channelHistoryStore = writable<IChannelHistory>(
  initialChannelHistory,
);
