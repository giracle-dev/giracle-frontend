import { onlineUserListStore } from "$lib/store/user";

interface IUserConnectWsOn {
  signal: "user::Connected";
  data: string;
}

export const userConnectWsOn = async (data: IUserConnectWsOn) => {
  if (data.signal === "user::Connected") {
    console.log("user::Connected====>", data.data);
    onlineUserListStore.update((onlineUserList) => {
      if (onlineUserList.includes(data.data)) return onlineUserList;
      return [...onlineUserList, data.data];
    });
  }
};
