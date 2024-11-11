import { inboxStore } from "$lib/store/inbox";
import type { IMessage } from "$lib/types/IMessage";

interface IResponseWsInboxAdded {
  signal: "inbox::Added";
  data: {
    message: IMessage;
    type: "mention" | "reply";
  };
}

export const inboxAddedWsOn = async (data: IResponseWsInboxAdded) => {
  if (data.signal === "inbox::Added") {
    console.log("inbox::Added====>", data.data);
    inboxStore.update((inbox) => {
      inbox.unshift({
        type: data.data.type,
        userId: data.data.message.userId,
        messageId: data.data.message.id,
        Message: data.data.message,
        happendAt: data.data.message.createdAt,
      });
      return inbox;
    });
  }
}
