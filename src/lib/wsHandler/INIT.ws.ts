import { sendMessageWsOn } from "./channel/sendMessage";
export let ws: WebSocket = new WebSocket("/ws");

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
  };

  ws.onerror = (event) => {
    console.log("INIT.ws :: initWS : error->", event);
  };

  ws.onmessage = (event) => {
    try {
      const json = JSON.parse(event.data);

      console.log("INIT.ws :: initWS : event->", json);
      sendMessageWsOn(json);

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
