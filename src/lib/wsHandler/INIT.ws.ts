export let ws: WebSocket;

export const initWS = () => {
  //WebSocketの接続確率
  ws = new WebSocket("/ws");

  ws.onopen = (event) => {
    //テスト
    ws.send(JSON.stringify({
      signal: "ping",
      data: null
    }));
    console.log("INIT.ws :: initWS : open->", event);
  }

  ws.onerror = (event) => {
    console.log("INIT.ws :: initWS : error->", event);
  }
  ws.onmessage = (event) => {
    console.log("INIT.ws :: initWS : event->", event.data);
  }
};