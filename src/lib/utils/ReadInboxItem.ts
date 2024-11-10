import { inboxStore } from "$lib/store/inbox";
import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
import { get } from "svelte/store";
import { channelHistoryStore } from "$lib/store/channelHistory";
const messageRepository = repositoryFactory.get("message");

/**
 * 通知されたメッセージを既読にする
 * @param messageId 
 * @returns void
 */
export const ReadInboxItem = async (messageId: string) => {
  const message = get(channelHistoryStore).history.find((m) => m.id === messageId);
  if (!message) return;

  const inboxForThis = get(inboxStore).find((i) => i.Message.channelId === message.channelId);
  if (!inboxForThis) return;

  //既読処理
  await messageRepository.readInboxItem(messageId).catch((e) => {
    console.error("ReadInboxItem :: エラー->", e);
  }).then(() => {
    //InboxStoreから既読したのを削除
    inboxStore.update((inbox) => {
      return inbox.filter((i) => i.messageId !== message.id);
    });
  });
  return;
};
