import { userListStore } from "$lib/store/user";

interface IUserConnectWsOn {
  signal: "role::Linked";
  data: {
    userId: string;
    roleId: string;
  };
}

export const roleLinkedWsOn = async (data: IUserConnectWsOn) => {
  if (data.signal === "role::Linked") {
    console.log("role::Linked====>", data.data);

    //ユーザーStoreの更新
    userListStore.update((userList) => {
      //ユーザーをStoreから探してIndexを取得
      const targetUserIndex = userList.findIndex(
        (user) => user.id === data.data.userId,
      );
      //Indexが無ければ停止
      if (targetUserIndex === -1) return userList;
      //StoreへロールIdを追加
      userList[targetUserIndex].RoleLink.push({
        roleId: data.data.roleId,
      });
      return userList;
    });
  }
};
