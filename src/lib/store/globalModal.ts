import type { IUser } from "$lib/types/IUser";
import { writable } from "svelte/store";

const initialGlobalModal: IUser | null = null;

export const globalModalStore = writable<IUser | null>(initialGlobalModal);
