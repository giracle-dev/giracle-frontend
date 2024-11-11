import { sendMessageWsOn } from "./channel/sendMessage";
import { updateMessageWsOn } from "./channel/updateMessage";
import { ReadTimeUpdated } from "./message/ReadTimeUpdated";
import { userConnectWsOn } from "./user/userConnected";
import { userDisconnectedWsOn } from "./user/userDisconnected";
import { deleteMessageWsOn } from "./message/deleteMessage";
import { writable } from "svelte/store";
import { inboxAddedWsOn } from "./message/inboxAdded";
import { inboxDeletedWsOn } from "./message/inboxDelete";

//WSインスタンス
export let ws: WebSocket = new WebSocket("/ws");
//WS接続状態Store
export const wsStatusStore = writable<WebSocket["readyState"]>(ws.readyState);

//WS接続がエラーで閉じられた場合のフラグ
let FLAGwsError = false;

export const initWS = () => {
  //既に接続済みの場合は再接続しない
  if (ws.readyState === ws.CLOSED) {
    ws = new WebSocket("/ws");
  }

  ws.onopen = (event) => {
    console.log("INIT.ws :: initWS : open->", event);
    //エラーフラグをリセット
    FLAGwsError = false;
    //接続状態を更新
    wsStatusStore.set(ws.readyState);
  };

  ws.onerror = (event) => {
    console.log("INIT.ws :: initWS : error->", event);
  };

  ws.onmessage = (event) => {
    try {
      const json = JSON.parse(event.data);

      console.log("INIT.ws :: initWS : event->", json);
      sendMessageWsOn(json);
      updateMessageWsOn(json);
      deleteMessageWsOn(json);
      inboxAddedWsOn(json);
      inboxDeletedWsOn(json);
      userConnectWsOn(json);
      userDisconnectedWsOn(json);
      ReadTimeUpdated(json);

      //トークンが無効な場合のフラグ設定
      if (json.signal === "ERROR" && json.data === "token not valid") {
        FLAGwsError = true;
      }
    } catch (e) {
      console.log("INIT.ws :: initWS : data->", event.data, " error->", e);
    }
  };

  ws.onclose = (event) => {
    console.log("INIT.ws :: initWS : close->", event);

    //接続状態を更新
    wsStatusStore.set(ws.readyState);
    //エラーで閉じられた場合は再接続しない
    if (FLAGwsError) return;

    //再接続
    setTimeout(
      () => {
        initWS();
      },
      Math.random() * 500 + 1000,
    );
  };

  // ブラウザの可視状態が変更されたときのイベントリスナー
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // ブラウザがアクティブになったときに WebSocket の接続状態を確認
      if (
        ws.readyState !== WebSocket.OPEN &&
        ws.readyState !== WebSocket.CONNECTING
      ) {
        initWS();
      }
    }
  });
};
