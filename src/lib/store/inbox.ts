import type { IInbox, IMessage } from "$lib/types/IMessage";
import { writable } from "svelte/store";

export const inboxStore = writable<IInbox[]>([]);
