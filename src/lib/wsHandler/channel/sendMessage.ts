import type { IMessage } from "$lib/types/IMessage";
import { channelHistoryStore } from "$lib/store/channelHistory";
import { hasNewMessageStore } from "$lib/store/messageReadTime";
import { userListStore } from "$lib/store/user";
import { channelListStore } from "$lib/store/channel";
import { get } from "svelte/store";
import { page } from "$app/stores";
import updateReadTime from "$lib/utils/updateReadTime";
import { ReadInboxItem } from "$lib/utils/ReadInboxItem";

interface IResponseWsSendMessage {
  signal: "message::SendMessage";
  data: IMessage;
}

//ウィンドウがフォーカスされているかどうか
let WINDOW_FOCUS = document.hasFocus();
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

//ブラウザ通知用インスタンス
let NOTIFICATION_INSTNCE: Notification | null = null;

export const sendMessageWsOn = async (data: IResponseWsSendMessage) => {
  if (data.signal === "message::SendMessage") {
    console.log("message::SendMessage====>", data.data);
    // 一番下に追加
    // 現在のチャンネルメッセージではない場合は追加しない
    if (get(page).params.id === data.data.channelId) {
      //Giracle自体がフォーカスされているなら既読時間を更新、違うなら新着とマーク
      if (WINDOW_FOCUS) {
        //既読時間も更新させる
        await updateReadTime(data.data.channelId, data.data.createdAt, true);
        //Inbox用の既読処理
        await ReadInboxItem(data.data.channelId);
        //console.log("sendMessage :: sendMessageWsOn : フォーカスされているから同期", WINDOW_FOCUS);
      } else {
        //新着設定
        hasNewMessageStore.update((hasNewMessage) => (
          {
            ...hasNewMessage,
            [data.data.channelId]: true,
          }
        ));

        //通知が表示されていることを考慮して閉じておく
        NOTIFICATION_INSTNCE?.close;
        //チャンネル名とユーザー名を取得
        let channelName = get(channelListStore).find((channel) => channel.id === data.data.channelId)?.name;
        let sendersName = get(userListStore).find((user) => user.id === data.data.userId)?.name;
        //通知を出す
        NOTIFICATION_INSTNCE = new Notification("#" + channelName + " :: " + sendersName, {
          body: data.data.content,
        });
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
      //console.log("hasNewMessageStore", get(hasNewMessageStore)[data.data.channelId]);
    }
  }
};
