import type { IServer } from "$lib/types/IServer";
import { writable } from "svelte/store";

const initialServerInfoValue: IServer = {
  name: "",
  introduction: "",
  RegisterAvailable: false,
  RegisterInviteOnly: false,
  MessageMaxLength: 0,
  defaultJoinChannel: []
};

export const serverInfoStore = writable<IServer>(initialServerInfoValue);
