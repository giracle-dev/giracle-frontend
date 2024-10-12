import type { IUser } from "$lib/types/IUser";
import { writable } from "svelte/store";

const initialMyUserValue: IUser = {
  id: "",
  name: "",
  description: "",
};

export const myUserStore = writable<IUser>(initialMyUserValue);
