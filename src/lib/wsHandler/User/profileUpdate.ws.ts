import { ws } from "../INIT.ws";

export default async function profileUpdate(
  data: {
    name: string;
    selfIntroduction: string;
  }
) {
  ws.send(JSON.stringify({
    signal: "profileUpdate",
    data: data
  }));
}