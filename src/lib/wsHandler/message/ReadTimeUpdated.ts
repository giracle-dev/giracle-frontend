import { hasNewMessageStore } from "$lib/store/messageReadTime";

interface IResponseWsReadTimeUpdated {
  signal: "message::ReadTimeUpdated";
  data: {
    channelId: string;
    userId: string;
    readTime: Date;
  };
}

export const ReadTimeUpdated = async (data: IResponseWsReadTimeUpdated) => {
  if (data.signal === "message::ReadTimeUpdated") {
    console.log("message::ReadTimeUpdated====>", data.data);
    //新着設定
    hasNewMessageStore.update((hasNewMessage) => (
      {
        ...hasNewMessage,
        [data.data.channelId]: false,
      }
    ));
  }
};
