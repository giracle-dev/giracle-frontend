import { channelListStore } from "$lib/store/channel";
import { channelHistoryStore } from "$lib/store/channelHistory";
import type { IChannel } from "$lib/types/IChannel";

interface IResponseWsUpdateChannel {
  signal: "channel::UpdateChannel";
  data: IChannel;
}

/**
 * チャンネル情報を更新する
 * @param data 
 */
export const updateChannelWsOn = async (data: IResponseWsUpdateChannel) => {
  if (data.signal === "channel::UpdateChannel") {
    console.log("message::UpdateChannel====>", data.data);
    //チャンネルデータを更新する
    channelListStore.update((channelList) => {
      const newChannelList = channelList.map((channel) => {
        if (channel.id === data.data.id) {
          return data.data;
        }
        return channel;
      });
      return newChannelList;
    });
  }
};
