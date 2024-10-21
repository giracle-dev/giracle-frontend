import type { IChannel, IChannelHistory } from "$lib/types/IChannel";
import type { IMessage } from "$lib/types/IMessage";
import { writable } from "svelte/store";

const initialMessageReadTime: {[key: string]: Date} = {};

export const MessageReadTimeStore = writable<{[key: string]: Date}>(
  initialMessageReadTime,
);
