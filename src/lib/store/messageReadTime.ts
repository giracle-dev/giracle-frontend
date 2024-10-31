import type { IChannel } from "$lib/types/IChannel";
import { writable } from "svelte/store";

//初期値
const initialHasNewMessage: {[key: IChannel["id"]]: boolean} = {};

//履歴の既読時間Store
export const MessageReadTimeStore = writable<{[key: string]: Date}>(
  {},
);
//履歴の既読時間Store
export const MessageReadTimeBeforeStore = writable<{[key: string]: Date}>(
  {},
);
//新着メッセージの有無Store
export const hasNewMessageStore = writable<{[key: IChannel["id"]]: boolean}>(
  initialHasNewMessage,
);
