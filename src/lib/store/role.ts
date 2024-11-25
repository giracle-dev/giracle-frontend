import type { IRole } from "$lib/types/IRole";
import { writable } from "svelte/store";

export const roleListStore = writable<IRole[]>([]);
