export let ws: WebSocket;

export const initWS = () => {
  /*
  console.log("initWS :: token->", document.cookie);
  let token: string = "";

  for (const c of document.cookie.split(";")) {
    console.log("initWS :: c->", c);
    if (c.startsWith("token=")) {
      console.log("initWS :: c->", c);
      token = c.split("=")[1];
    }
  }

  if (token === "") return;
  */

  ws = new WebSocket("/ws");
  ws.onerror = (event) => {
    console.log("INIT.ws :: initWS : error->", event);
  }
  ws.onmessage = (event) => {
    console.log("INIT.ws :: initWS : event->", event.data);
  }
};