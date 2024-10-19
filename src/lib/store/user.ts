import type { IUser } from "$lib/types/IUser";
import { writable } from "svelte/store";

const initialMyUserValue: IUser = {
  id: "",
  name: "",
  selfIntroduction: "",
  ChannelJoin: [],
  RoleLink: [],
};

export const myUserStore = writable<IUser>(initialMyUserValue);

const initialUserListValue: IUser[] = [];

export const userListStore = writable<IUser[]>(initialUserListValue);
