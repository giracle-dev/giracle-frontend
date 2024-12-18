import { sendMessageWsOn } from "./channel/sendMessage";
import { updateMessageWsOn } from "./channel/updateMessage";
import { ReadTimeUpdated } from "./message/ReadTimeUpdated";
import { userConnectWsOn } from "./user/userConnected";
import { userDisconnectedWsOn } from "./user/userDisconnected";
import { deleteMessageWsOn } from "./message/deleteMessage";
import { writable } from "svelte/store";
import { inboxAddedWsOn } from "./message/inboxAdded";
import { inboxDeletedWsOn } from "./message/inboxDelete";
import { updateChannelWsOn } from "./channel/updateChannel";
import { onlineUserListStore } from "$lib/store/user";
import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
import { roleLinkedWsOn } from "./role/roleLinked";
import { roleUnlinkedWsOn } from "./role/roleUnlinked";
import { roleUpdatedWsOn } from "./role/roleUpdated";
import { roleDeletedWsOn } from "./role/roleDeleted";
import { roleCreatedWsOn } from "./role/roleCreated";

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

    //オンラインユーザー情報を同期する
    const userRepository = repositoryFactory.get("user");
    userRepository.getOnline().then((response) => {
      console.log(
        "INIT.ws :: onmessage : response(getOnline)->",
        response,
      );
      onlineUserListStore.set(response.data);
    });
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
      updateChannelWsOn(json);
      roleLinkedWsOn(json);
      roleUnlinkedWsOn(json);
      roleUpdatedWsOn(json);
      roleDeletedWsOn(json);
      roleCreatedWsOn(json);
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
