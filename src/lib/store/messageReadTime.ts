import type { IChannel } from "$lib/types/IChannel";
import { writable } from "svelte/store";

//初期値
const initialMessageReadTime: {[key: string]: Date} = {};
const initialHasNewMessage: {[key: IChannel["id"]]: boolean} = {};

//履歴の既読時間Store
export const MessageReadTimeStore = writable<{[key: string]: Date}>(
  initialMessageReadTime,
);
//履歴の既読時間Store
export const MessageReadTimeBeforeStore = writable<{[key: string]: Date}>(
  initialMessageReadTime,
);
//新着メッセージの有無Store
export const hasNewMessageStore = writable<{[key: IChannel["id"]]: boolean}>(
  initialHasNewMessage,
);
