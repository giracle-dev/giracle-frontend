import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
const messageRepository = repositoryFactory.get("message");

export default async function updateReadTime(
  channelId: string,
  readTime: Date
): Promise<void> {
  console.log("updateReadTime :: 既読時間の更新", channelId, readTime);
  //既読時間の更新
  messageRepository
    .updateReadTime(
      channelId,
      readTime,
    )
    .then((res) => {
      console.log("updateReadTime :: 既読時間の更新", res);
    })
    .catch((err) => {
      console.error("updateReadTime :: 既読時間の更新に失敗->", err);
    });
}