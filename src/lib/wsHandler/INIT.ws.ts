import { sendMessageWsOn } from "./channel/sendMessage";
export let ws: WebSocket = new WebSocket("/ws");

//WS接続がエラーで閉じられた場合のフラグ
let FLAGwsError = false;

export const initWS = () => {
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
};
