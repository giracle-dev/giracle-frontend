import type { IMessage } from "$lib/types/IMessage";
import { channelHistoryStore } from "$lib/store/channelHistory";
import { hasNewMessageStore } from "$lib/store/messageReadTime";
import { get } from "svelte/store";
import { page } from "$app/stores";
import updateReadTime from "$lib/utils/updateReadTime";

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
      //既読時間も更新させる
      updateReadTime(data.data.channelId, data.data.createdAt);
    } else {
      //新着設定
      hasNewMessageStore.update((hasNewMessage) => (
        {
          ...hasNewMessage,
          [data.data.channelId]: true,
        }
      ));
      console.log("hasNewMessageStore", get(hasNewMessageStore)[data.data.channelId]);
    }
  }
};
