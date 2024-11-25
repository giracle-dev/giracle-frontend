import { updateMyRolePower } from "$lib/store/myRolePower";
import { roleListStore } from "$lib/store/role";
import type { IRole } from "$lib/types/IRole";

interface IResponseWsRoleUpdated {
  signal: "role::Updated";
  data: IRole;
}

export const roleUpdatedWsOn = async (data: IResponseWsRoleUpdated) => {
  if (data.signal === "role::Updated") {
    console.log("roleUpdatedWsOn", data);
    roleListStore.update((roleList) => {
      return roleList.map((role) => {
        if (role.id === data.data.id) {
          return data.data;
        }
        return role;
      });
    });
    //自分の権限Store更新
    updateMyRolePower();
  }
};
