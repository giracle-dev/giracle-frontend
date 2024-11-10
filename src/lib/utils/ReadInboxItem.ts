import { inboxStore } from "$lib/store/inbox";
import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
import { get } from "svelte/store";
const messageRepository = repositoryFactory.get("message");

/**
 * 通知されたメッセージを既読にする
 * @param messageId 
 * @returns void
 */
export const ReadInboxItem = async (messageId: string) => {
  const inboxForThis = get(inboxStore).find((i) => i.Message.id === messageId);
  //console.log("ReadInboxItem :: inboxForThis ->", inboxForThis);
  if (!inboxForThis) return;

  //既読処理
  await messageRepository.readInboxItem(messageId).catch((e) => {
    console.error("ReadInboxItem :: エラー->", e);
  }).then(() => {
    //InboxStoreから既読したのを削除
    inboxStore.update((inbox) => {
      return inbox.filter((i) => i.messageId !== messageId);
    });
  }).catch((e) => { 
    console.error("ReadInboxItem :: エラー->", e);
  });
  return;
};
