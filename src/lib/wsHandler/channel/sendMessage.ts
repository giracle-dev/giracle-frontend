import type { IMessage } from "$lib/types/IMessage";
import { channelHistoryStore } from "$lib/store/channelHistory";

interface IResponseWsSendMessage {
  signal: "message::SendMessage";
  data: IMessage;
}

export const sendMessageWsOn = async (data: IResponseWsSendMessage) => {
  if (data.signal === "message::SendMessage") {
    console.log(data.data);
    // 一番下に追加
    channelHistoryStore.update((channelHistory) => {
      return [data.data, ...channelHistory];
    });
  }
};
