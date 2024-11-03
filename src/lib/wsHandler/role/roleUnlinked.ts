import { userListStore } from "$lib/store/user";

interface IRoleUnlinkedWsOn {
  signal: "role::Unlinked";
  data: {
    userId: string;
    roleId: string;
  };
}

export const roleUnlinkedWsOn = async (data: IRoleUnlinkedWsOn) => {
  if (data.signal === "role::Unlinked") {
    console.log("role::Unlinked====>", data.data);

    //ユーザーStoreの更新
    userListStore.update((userList) => {
      //ユーザーをStoreから探してIndexを取得
      const targetUserIndex = userList.findIndex(
        (user) => user.id === data.data.userId,
      );
      //Indexが無ければ停止
      if (targetUserIndex === -1) return userList;

      //ロールのIndex取得
      const targetRoleIndex = userList[targetUserIndex].RoleLink.findIndex(
        (role) => role.roleId === data.data.roleId,
      );
      //Indexが無ければ停止
      if (targetRoleIndex === -1) return userList;

      //ロール削除
      userList[targetUserIndex].RoleLink.splice(targetRoleIndex, 1);

      return userList;
    });
  }
};
