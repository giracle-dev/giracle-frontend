import { channelHistoryStore } from "$lib/store/channelHistory";

interface IResponseWsDeleteMessage {
    signal: "message::MessageDeleted";
    data: string;
}

export const deleteMessageWsOn = async (data: IResponseWsDeleteMessage) => {
    if (data.signal === "message::MessageDeleted") {
        console.log("message::MessageDeleted====>", data.data);
        channelHistoryStore.update((channelHistory) => {
            const newHistory = channelHistory.history.filter(message=> message.id !== data.data);
            return {
                history: newHistory,
                atTop: channelHistory.atTop,
                atEnd: channelHistory.atEnd,
            };
        });
    }
};
