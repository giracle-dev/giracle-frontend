import type { IRole } from "$lib/types/IRole";
import { get, writable } from "svelte/store";
import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
const roleRepository = repositoryFactory.get("role");

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

const getRoleInfo = async (id: string) => {
  if (get(roleStore)[id]) return get(roleStore)[id];

  //ロールがなければ取得してから返す
  await roleRepository
    .getRoleInfo(id)
    .then((res) => {
      roleStore.update((roles) => {
        roles[id] = res.data;
        return roles;
      });
      return get(roleStore)[id];
    })
    .catch(() => {
      return {
        id: "ERROR",
        name: "エラー",
        color: "#f00",
        createdAt: new Date(),
        createdUserId: "SYSTEM",
        manageUser: false,
        manageChannel: false,
        manageRole: false,
        manageServer: false,
      };
    });
}
