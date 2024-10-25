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

/**
 * Storeからロール情報を取得する
 * @param id 
 * @returns 
 */
export const getRoleInfo = async (id: string): Promise<IRole> => {
  if (get(roleStore)[id]) return get(roleStore)[id];

  console.log("store(role) :: getRoleInfo : Storeにないので取得します roleId->", id);

  //ロールがなければ取得してから返す
  try {
    roleStore.update((roles) => {
      roles[id] = {
        id: id,
        name: "Loading...",
        color: "#fff",
        createdAt: new Date(),
        createdUserId: "SYSTEM",
        manageUser: false,
        manageChannel: false,
        manageRole: false,
        manageServer: false,
      };
      return roles;
    });
    const res = await roleRepository.getRoleInfo(id);
    roleStore.update((roles) => {
      roles[id] = res.data;
      return roles;
    });
    return get(roleStore)[id];
  } catch {
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
  }
}
