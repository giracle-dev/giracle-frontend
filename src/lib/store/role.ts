import type { IRole } from "$lib/types/IRole";
import { writable } from "svelte/store";

const initialRole: {[key: IRole["id"]]: IRole} = {
  "HOST": {
    id: "HOST",
    name: "Host",
    color: "#fff",
    createdAt: new Date(),
    createdUserId: "SYSTEM",
    manageUser: false,
    manageChannel: false,
    manageRole: false,
    manageServer: true,
  }
};

export const roleStore = writable<{[key: string]: IRole}>(initialRole);
