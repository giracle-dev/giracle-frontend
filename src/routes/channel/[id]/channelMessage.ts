import { page } from "$app/stores";
import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
import { channelHistoryStore } from "$lib/store/channelHistory";
import { toastStore } from "$lib/store/toast";
import { userListStore } from "$lib/store/user";
import { inboxStore } from "$lib/store/inbox";
import type { IChannel } from "$lib/types/IChannel";
import type { IMessage } from "$lib/types/IMessage";
import { get } from "svelte/store";
import { ReadInboxItem } from "$lib/utils/ReadInboxItem";
const messageRepository = repositoryFactory.get("message");
const channelRepository = repositoryFactory.get("channel");

/**
 *  ユーザー名を取得する
 */
/*
export const getUserName = (userId: string) => {
  const getUserList = get(userListStore);
  const user = getUserList.find((user) => user.id === userId);
  return user?.name ?? "名無し";
};
*/

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
  return year + "/" + month + "/" + day + " " + d.toLocaleTimeString();
};

/**
 * チャンネルメッセージを取得する
 * @param targetMessage
 * @param targetMessageTime
 * @param direction (older | newer)
 * @param messageIdFrom
 * @returns void (channelHistoryStoreにメッセージを追加)
 */
export const getChannelHistory = async (
  targetMessage?: IMessage,
  targetMessageTime?: Date,
  direction?: "older" | "newer",
  messageIdFrom?: string,
) => {
  if (direction === "older" && get(channelHistoryStore).atTop) return;
  if (direction === "newer" && get(channelHistoryStore).atEnd) return;

  const createMessageIdFrom = () => {
    if (targetMessage) {
      return targetMessage.id;
    } else if (messageIdFrom) {
      return messageIdFrom;
    } else {
      return undefined;
    }
  };

  await channelRepository
    .getHistory(get(page).params.id, {
      messageIdFrom: createMessageIdFrom(),
      targetMessageTime: targetMessageTime ?? undefined,
      fetchDirection: direction ?? undefined,
      fetchLength: 30,
    })
    .then((res) => {
      console.log("/channel/[id] :: getChannelHistory : res->", res);
      if (direction === "older") {
        // 配列の一番下に追加
        // 重複しているメッセージを除外
        const newMessages = res.data.history.filter(
          (message) =>
            !get(channelHistoryStore).history.some(
              (oldMessage) => oldMessage.id === message.id,
            ),
        );
        channelHistoryStore.update((messages) => ({
          // 既存メッセージを配列の最初に追加
          history: [...messages.history, ...newMessages],
          atTop: res.data.atTop,
          atEnd: messages.atEnd,
        }));
      } else if (direction === "newer") {
        // 重複しているメッセージを除外
        const newMessages = res.data.history.filter(
          (message) =>
            !get(channelHistoryStore).history.some(
              (oldMessage) => oldMessage.id === message.id,
            ),
        );
        channelHistoryStore.update((messages) => ({
          // 既存メッセージを配列の最後に追加
          history: [...newMessages, ...messages.history],
          atTop: messages.atTop,
          atEnd: res.data.atEnd,
        }));
      } else {
        channelHistoryStore.set(res.data);
      }

      //このチャンネル用のInbox取得
      const inboxForCurrentChannel = get(inboxStore).filter(
        (i) => i.Message.channelId === get(page).params.id,
      );
      //取得した履歴にInbox内のメッセージがあれば既読にする
      for (const message of res.data.history) {
        const msgFind = inboxForCurrentChannel.find(
          (i) => i.messageId === message.id,
        );
        if (msgFind) {
          ReadInboxItem(msgFind.messageId);
        }
      }
    })
    .catch((err) => {
      console.log("channelMessage :: getChannelHistory : err->", err);
    });
};

/**
 * 一番上までスクロールした時に、チャンネルメッセージを取得する
 */
let isScrollLoading = false;
export const scrollHandler = async () => {
  const MessageContainer = document.getElementById("messageContainer");
  // スクロールが一番上まで行ったかどうか
  if (MessageContainer) {
    //100は誤差範囲のため
    const isScrolledToTop =
      Math.abs(MessageContainer.scrollTop) >=
      MessageContainer.scrollHeight - MessageContainer.clientHeight - 100;
    const isBottom = MessageContainer?.scrollTop === 0;

    if (isScrolledToTop) {
      const targetMessage =
        get(channelHistoryStore).history[
          get(channelHistoryStore).history.length - 1
        ];
      if (isScrollLoading) return;
      isScrollLoading = true;
      await getChannelHistory(targetMessage, undefined, "older").then(() => {
        isScrollLoading = false;
      });
    }

    if (isBottom) {
      console.log("scrollHandler :: isBottom");
      const targetMessage = get(channelHistoryStore).history[0];
      if (isScrollLoading) return;
      isScrollLoading = true;
      await getChannelHistory(targetMessage, undefined, "newer").then(() => {
        isScrollLoading = false;
      });
    }
  }
};

/**
 *　メッセージをリンクに変換する
 * @param text
 * @returns string
 */
export const linkify = (text: string) => {
  const channelList: IChannel[] = [];
  const getUserList = get(userListStore);
  const urlPattern =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  const mentionPattern = /@<([a-f0-9-]+)>/g;
  const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const htmlTagPattern = /<\/?[^>]+(>|$)/g;
  const channelPattern = /#<([a-f0-9-]+)>/g;
  const codeSnippetPattern = /```([^`]+)```/g;
  const inlineCodePattern = /`([^`]+)`/g;
  const newlinePattern = /\n/g;

  // スクリプトタグをエスケープ
  text = text.replace(scriptPattern, (match) => {
    return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  });

  // プレースホルダーを使ってリンクとメンションを一時的に置き換え
  const placeholders: { placeholder: string; content: string }[] = [];
  let placeholderIndex = 0;

  // メンションを変換
  text = text.replace(mentionPattern, (_match, userId) => {
    const userInfo = getUserList.find((user) => user.id === userId);
    const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
    placeholders.push({
      placeholder,
      content: userInfo
        ? `<span class="w-fit inline-flex items-center glass px-1 rounded-lg">@<img src="/api/user/icon/${userInfo.id}" alt="i" class="w-5 h-5 rounded-full object-cover"  /> ${userInfo.name}</span>`
        : `<span class="w-fit inline-flex items-center glass px-1 rounded-lg">@Unknown User</span>`,
    });
    return placeholder;
  });

  // リンクを変換
  text = text.replace(urlPattern, (match) => {
    const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
    placeholders.push({
      placeholder,
      content: `<a href="${match}" class="text-blue-700" target="_blank" rel="noopener noreferrer">${match}</a>`,
    });
    return placeholder;
  });

  // チャンネルIDを変換
  text = text.replace(channelPattern, (_match, channelId) => {
    const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
    // チャンネルリストからチャンネル名を取得
    const channel = channelList.find((channel) => channel.id === channelId);
    const channelName = channel ? channel.name : "Unknown Channel";
    placeholders.push({
      placeholder,
      content: `<a href="/channel/${channelId}" class="w-fit inline-flex items-center glass px-1 rounded-lg" rel="noopener noreferrer">#${channelName}</a>`,
    });
    return placeholder;
  });

  // コードスニペットを変換
  text = text.replace(codeSnippetPattern, (_match, code) => {
    const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
    placeholders.push({
      placeholder,
      content: `<pre class="overflow-x-auto bg-base-300 p-2 outline outline-1	 rounded"><code>${code}</code>`,
    });
    return placeholder;
  });

  // インラインコードを変換
  text = text.replace(inlineCodePattern, (_match, code) => {
    const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
    placeholders.push({
      placeholder,
      content: `<code class=" bg-base-300 p-1 outline outline-1	 rounded">${code}</code>`,
    });
    return placeholder;
  });

  // 改行を変換
  text = text.replace(newlinePattern, (_match) => {
    const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
    placeholders.push({
      placeholder,
      content: "<br>",
    });
    return placeholder;
  });

  // その他のHTMLタグをエスケープ
  text = text.replace(htmlTagPattern, (match) => {
    return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  });

  // プレースホルダーを元に戻す
  placeholders.forEach(({ placeholder, content }) => {
    text = text.replace(placeholder, content);
  });

  return text;
};

/**
 * メッセージを送信する
 */
export const sendMessage = async (event: CustomEvent) => {
  const message = event.detail.message;
  const fileIds = event.detail.fileIds;
  console.log("/channel/[id] :: sendMessage : message->", message);
  await messageRepository
    .sendMessage(get(page).params.id, message, fileIds)
    .then((res) => {
      console.log("/channel/[id] :: sendMessage : res->", res);
    })
    .catch((err) => {
      console.error("/channel/[id] :: sendMessage : err->", err);

      toastStore.update((toast) => {
        return [
          ...toast,
          {
            message: "メッセージの送信に失敗しました",
            type: "error",
          },
        ];
      });
    });
};
