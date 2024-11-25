import { updateMyRolePower } from "$lib/store/myRolePower";
import { myUserStore } from "$lib/store/user";
import { get } from "svelte/store";

interface IResponseWsRoleUnlinked {
    signal: "role::Unlinked";
    data: {
      userId: string,
      roleId: string,
    };
}

export const roleUnlinkedWsOn = async (data: IResponseWsRoleUnlinked) => {
  if (data.signal === "role::Unlinked") {
    if (data.data.userId === get(myUserStore).id) {
      //自分のユーザーStore更新
      myUserStore.update((myUser) => {
        //ロールリンクから指定のロールIdを削除
        const RoleLink = myUser.RoleLink.filter((role) => role.roleId !== data.data.roleId);
        return {
          ...myUser,
          RoleLink
        };
      });
      //自分の権限Store更新
      updateMyRolePower();
    }
  }
};
