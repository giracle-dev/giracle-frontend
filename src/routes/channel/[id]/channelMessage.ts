import { page } from "$app/stores";
import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
import { channelHistoryStore } from "$lib/store/channelHistory";
import { userListStore } from "$lib/store/user";
import type { IMessage, IRequestChannelHistoryBody } from "$lib/types/IMessage";
import { get } from "svelte/store";
const messageRepository = repositoryFactory.get("message");
const channelRepository = repositoryFactory.get("channel");

/**
 *  ユーザー名を取得する
 */
export const getUserName = (userId: string) => {
  const getUserList = get(userListStore);
  const user = getUserList.find((user) => user.id === userId);
  return user?.name ?? "名無し";
};

/**
 *　日付をフォーマットする
 *  @param date
 * @returns "YYYY-MM-DD HH:mm:ss"
 */
export const formatDate = (date: Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return year + "-" + month + "-" + day + " " + d.toLocaleTimeString();
};

/**
 * チャンネルメッセージを取得する
 * @param targetMessage
 * @returns void (channelHistoryStoreにメッセージを追加)
 */
export const getChannelHistory = async (
  targetMessage?: IMessage,
  direction?: "older" | "newer",
) => {
  await channelRepository
    .getHistory(get(page).params.id, {
      messageIdFrom: targetMessage?.id ?? undefined,
      fetchDirection: direction ?? undefined,
      fetchLength: 30,
    })
    .then((res) => {
      if (direction === "older") {
        // 配列の一番下に追加
        // 取得した時にリクエストした時のIDも含まれるので、除外する
        const newMessages = res.data.history.filter(
          (message) => message.id !== targetMessage?.id,
        );
        channelHistoryStore.update((messages) => ({
          // 既存メッセージを配列の最初に追加
          history: [...messages.history, ...newMessages],
          atTop: res.data.atTop,
          atEnd: res.data.atEnd,
        }));
      } else if (direction === "newer") {
        // 取得した時にリクエストした時のIDも含まれるので、除外する
        const newMessages = res.data.history.filter(
          (message) => message.id !== targetMessage?.id,
        );
        channelHistoryStore.update((messages) => ({
          // 既存メッセージを配列の最後に追加
          history: [...newMessages, ...messages.history],
          atTop: res.data.atTop,
          atEnd: res.data.atEnd,
        }));
      } else {
        channelHistoryStore.set(res.data);
      }
    });
};

/**
 * 一番上までスクロールした時に、チャンネルメッセージを取得する
 */
export const scrollHandler = async () => {
  const MessageContainer = document.getElementById("messageContainer");
  // スクロールが一番上まで行ったかどうか
  if (MessageContainer) {
    let test = MessageContainer.scrollHeight - MessageContainer.clientHeight;
    const isScrolledToTop =
      Math.abs(MessageContainer.scrollTop) >=
      MessageContainer.scrollHeight - MessageContainer.clientHeight;
    const isBottom = MessageContainer?.scrollTop === 0;

    if (isScrolledToTop) {
      const targetMessage =
        get(channelHistoryStore).history[
          get(channelHistoryStore).history.length - 1
        ];
      await getChannelHistory(targetMessage, "older");
    }

    if (isBottom) {
      const targetMessage = get(channelHistoryStore).history[0];
      await getChannelHistory(targetMessage, "newer");
    }
  }
};
