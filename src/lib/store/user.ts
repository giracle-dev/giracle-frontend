import type { IUser } from "$lib/types/IUser";
import { writable } from "svelte/store";

const initialMyUserValue: IUser = {
  id: "",
  name: "",
  selfIntroduction: "",
  ChannelJoin: [],
  RoleLink: [],
};

const initialOnlineUserListValue: string[] = [];

const initialUserListValue: IUser[] = [];

export const myUserStore = writable<IUser>(initialMyUserValue);
export const userListStore = writable<IUser[]>(initialUserListValue);
export const onlineUserListStore = writable<string[]>(
  initialOnlineUserListValue,
);
