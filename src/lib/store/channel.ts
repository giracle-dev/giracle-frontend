import type { IChannel } from "$lib/types/IChannel";
import { writable } from "svelte/store";

const initialChannelList: IChannel[] = [];

export const channelListStore = writable<IChannel[]>(initialChannelList);
