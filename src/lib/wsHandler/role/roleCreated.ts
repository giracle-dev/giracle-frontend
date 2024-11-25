import { roleListStore } from "$lib/store/role";
import type { IRole } from "$lib/types/IRole";

interface IResponseWsRoleCreated {
  signal: "role::Created";
  data: IRole;
}

export const roleCreatedWsOn = async (data: IResponseWsRoleCreated) => {
  if (data.signal === "role::Created") {
    //ロールリストStoreへ追加
    roleListStore.update((roleList) => {
      return [...roleList, data.data];
    });
  }
};
