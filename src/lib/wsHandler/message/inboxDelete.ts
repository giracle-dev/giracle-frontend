import { inboxStore } from "$lib/store/inbox";
import type { IMessage } from "$lib/types/IMessage";

interface IResponseWsInboxAdded {
  signal: "inbox::Deleted";
  data: {
    message: IMessage;
    type: "mention" | "reply";
  };
}

export const inboxDeletedWsOn = async (data: IResponseWsInboxAdded) => {
  if (data.signal === "inbox::Deleted") {
    console.log("inbox::Deleted====>", data.data);
    inboxStore.update((inbox) => {
      const index = inbox.findIndex(
        (item) => item.messageId === data.data.message.id
      );
      if (index > -1) {
        inbox.splice(index, 1);
      }
      return inbox;
    });
  }
}
