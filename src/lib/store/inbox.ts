import type { IMessage } from "$lib/types/IMessage";
import { writable } from "svelte/store";

interface IInbox {
  type: "event" | "mention" | "reply";
  userId: string;
  messageId: string;
  Message: IMessage;
  happendAt: Date;
}

export const inboxStore = writable<IInbox[]>([]);
