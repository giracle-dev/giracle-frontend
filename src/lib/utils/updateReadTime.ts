import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
import { MessageReadTimeStore } from "$lib/store/messageReadTime";
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