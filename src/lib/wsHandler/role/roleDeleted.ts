import { updateMyRolePower } from "$lib/store/myRolePower";
import { roleListStore } from "$lib/store/role";
import { myUserStore } from "$lib/store/user";

interface IResponseWsRoleDeleted {
  signal: "role::Deleted";
  data: string;
}

export const roleDeletedWsOn = async (data: IResponseWsRoleDeleted) => {
  if (data.signal === "role::Deleted") {
    //ロールリストStoreから削除
    roleListStore.update((roleList) => {
      return roleList.filter((role) => role.id !== data.data);
    });
    //自分のユーザーStoreから削除
    myUserStore.update((myUser) => {
      return {
        ...myUser,
        RoleLink: myUser.RoleLink.filter((r) => r.roleId !== data.data)
      };
    });
    //自分の権限Store更新
    updateMyRolePower();
  }
};
