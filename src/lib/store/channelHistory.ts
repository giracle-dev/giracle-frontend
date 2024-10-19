import type { IChannel } from "$lib/types/IChannel";
import type { IMessage } from "$lib/types/IMessage";
import { writable } from "svelte/store";

const initialChannelHistory: IMessage[] = [];

export const channelHistoryStore = writable<IMessage[]>(initialChannelHistory);
