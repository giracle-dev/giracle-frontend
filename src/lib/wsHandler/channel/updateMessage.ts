import type { IMessage } from "$lib/types/IMessage";
import { channelHistoryStore } from "$lib/store/channelHistory";

interface IResponseWsUpdateMessage {
  signal: "message::UpdateMessage";
  data: IMessage;
}

export const updateMessageWsOn = async (data: IResponseWsUpdateMessage) => {
  if (data.signal === "message::UpdateMessage") {
    console.log("message::UpdateMessage====>", data.data);
    // メッセージを更新
    channelHistoryStore.update((channelHistory) => {
      const newHistory = channelHistory.history.map((message) => {
        if (message.id === data.data.id) {
          return data.data;
        }
        return message;
      });
      return {
        history: newHistory,
        atTop: channelHistory.atTop,
        atEnd: channelHistory.atEnd,
      };
    });
  }
};
