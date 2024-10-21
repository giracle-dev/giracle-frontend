import type { IMessage } from "$lib/types/IMessage";
import { channelHistoryStore } from "$lib/store/channelHistory";
import { get } from "svelte/store";
import { page } from "$app/stores";

interface IResponseWsSendMessage {
  signal: "message::SendMessage";
  data: IMessage;
}

export const sendMessageWsOn = async (data: IResponseWsSendMessage) => {
  if (data.signal === "message::SendMessage") {
    console.log("message::SendMessage====>", data.data);
    // 一番下に追加
    // 現在のチャンネルメッセージではない場合は追加しない
    if (get(page).params.id === data.data.channelId) {
      channelHistoryStore.update((channelHistory) => ({
        history: [data.data, ...channelHistory.history],
        atTop: channelHistory.atTop,
        atEnd: channelHistory.atEnd,
      }));
    }
  }
};
