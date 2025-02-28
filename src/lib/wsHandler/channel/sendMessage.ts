import type { IMessage } from "$lib/types/IMessage";
import { channelHistoryStore } from "$lib/store/channelHistory";
import { hasNewMessageStore } from "$lib/store/messageReadTime";
import { myUserStore, userListStore } from "$lib/store/user";
import { channelListStore } from "$lib/store/channel";
import { get } from "svelte/store";
import { page } from "$app/state";
import updateReadTime from "$lib/utils/updateReadTime";
import { ReadInboxItem } from "$lib/utils/ReadInboxItem";
import { goto } from "$app/navigation";

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
    if (page.params.id === data.data.channelId) {
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

        //自分に対するメンション文があるなら通知
        if (data.data.content.includes("@<" + get(myUserStore).id + ">")) notify(data.data);
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

      //自分に対するメンション文があるなら通知
      if (data.data.content.includes("@<" + get(myUserStore).id + ">")) notify(data.data);
    }
  }
};

/**
 * ブラウザ通知を出す
 * @param msg 通知するメッセージデータ
 */
const notify = (msg: IMessage) => {
  //通知が表示されていることを考慮して閉じておく
  if (NOTIFICATION_INSTNCE) NOTIFICATION_INSTNCE.close();
  //チャンネル名とユーザー名を取得
  let channelName = get(channelListStore).find((channel) => channel.id === msg.channelId)?.name;
  let sendersName = get(userListStore).find((user) => user.id === msg.userId)?.name;
  
  //通知を出す
  NOTIFICATION_INSTNCE = new Notification("#" + channelName + " :: " + sendersName, {
    body: msg.content,
    icon: "/api/users/icon/" + msg.userId,
    
  });
  //通知がクリックされたらチャンネルに飛ぶ
  NOTIFICATION_INSTNCE.onclick = () => {
    goto("/channel/" + msg.channelId);
  };
}
