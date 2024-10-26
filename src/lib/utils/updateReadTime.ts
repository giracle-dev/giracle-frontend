import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
import { MessageReadTimeStore, MessageReadTimeBeforeStore } from "$lib/store/messageReadTime";
import { get } from "svelte/store";
const messageRepository = repositoryFactory.get("message");

export default async function updateReadTime(
  channelId: string,
  readTime: Date
): Promise<void> {
  console.log("updateReadTime :: 既読時間の更新", channelId, readTime);
  //既読時間Storeが新しければ更新しない
  if (get(MessageReadTimeStore)[channelId] >= readTime) return;

  //既読時間の更新
  messageRepository
    .updateReadTime(
      channelId,
      readTime,
    )
    .then((res) => {
      console.log("updateReadTime :: 既読時間の更新", res);
      //最後の既読時間用Storeへ既読時間を格納
      MessageReadTimeBeforeStore.update((store) => {
        store[channelId] = get(MessageReadTimeStore)[channelId];
        return store;
      });
      //既読時間Storeを更新
      MessageReadTimeStore.update((store) => {
        store[channelId] = readTime;
        return store;
      });
    })
    .catch((err) => {
      console.error("updateReadTime :: 既読時間の更新に失敗->", err);
    });
}