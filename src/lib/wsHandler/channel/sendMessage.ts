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

//ウィンドウがフォーカスされているかどうか
let WINDOW_FOCUS = false;
//ウィンドウがフォーカスされているかどうかの判定
window.addEventListener('focus', () => {
  // ウィンドウがフォーカスを得たときの処理
  WINDOW_FOCUS = true;
});
//ウィンドウがフォーカスされていないかどうかの判定
window.addEventListener('blur', () => {
  // ウィンドウがフォーカスを失ったときの処理
  WINDOW_FOCUS = false;
});

export const sendMessageWsOn = async (data: IResponseWsSendMessage) => {
  if (data.signal === "message::SendMessage") {
    console.log("message::SendMessage====>", data.data);
    // 一番下に追加
    // 現在のチャンネルメッセージではない場合は追加しない
    if (get(page).params.id === data.data.channelId) {
      //Giracle自体がフォーカスされているなら既読時間を更新、違うなら新着とマーク
      if (WINDOW_FOCUS) {
        //既読時間も更新させる
        updateReadTime(data.data.channelId, data.data.createdAt, true);
        console.log("sendMessage :: sendMessageWsOn : フォーカスされているから同期", WINDOW_FOCUS);
      } else {
        //新着設定
        hasNewMessageStore.update((hasNewMessage) => (
          {
            ...hasNewMessage,
            [data.data.channelId]: true,
          }
        ));
      }

      //履歴Storeへ追加
      channelHistoryStore.update((channelHistory) => ({
        history: [data.data, ...channelHistory.history],
        atTop: channelHistory.atTop,
        atEnd: channelHistory.atEnd,
      }));
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
