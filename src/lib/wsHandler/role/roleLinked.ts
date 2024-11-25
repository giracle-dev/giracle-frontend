import { updateMyRolePower } from "$lib/store/myRolePower";
import { myUserStore } from "$lib/store/user";
import { get } from "svelte/store";

interface IResponseWsRoleLinked {
    signal: "role::Linked";
    data: {
      userId: string,
      roleId: string,
    };
}

export const roleLinkedWsOn = async (data: IResponseWsRoleLinked) => {
  if (data.signal === "role::Linked") {
    if (data.data.userId === get(myUserStore).id) {
      //自分のユーザーStore更新
      myUserStore.update((myUser) => {
        return {
          ...myUser,
          RoleLink: [...myUser.RoleLink, {roleId: data.data.roleId}]
        };
      });
      //自分の権限Store更新
      updateMyRolePower();
    }
  }
};
