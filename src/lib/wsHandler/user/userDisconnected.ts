import { onlineUserListStore } from "$lib/store/user";

interface IUserDisconnectWsOn {
  signal: "user::Disconnected";
  data: string;
}

export const userDisconnectedWsOn = async (data: IUserDisconnectWsOn) => {
  if (data.signal === "user::Disconnected") {
    console.log("user::Disconnected====>", data.data);
    onlineUserListStore.update((onlineUserList) => {
      return onlineUserList.filter((user) => user !== data.data);
    });
  }
};
