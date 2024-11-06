<script lang="ts">
  import { page } from "$app/stores";
  import { channelHistoryStore } from "$lib/store/channelHistory";
  import { onlineUserListStore, userListStore } from "$lib/store/user";
  import {
    formatDate,
    getChannelHistory,
    scrollHandler,
    linkify,
    sendMessage,
  } from "./channelMessage";
  import { onDestroy, onMount } from "svelte";
  import UserProfile from "$lib/components/unique/userProfile.svelte";
  import HoverMenu from "./hoverMenu.svelte";
  import updateReadTime from "$lib/utils/updateReadTime";
  import FilePreview from "./FilePreview.svelte";
  import MessageInput from "./MessageInput.svelte";
  import NewMessageLine from "./NewMessageLine.svelte";
  import { MessageReadTimeBeforeStore } from "$lib/store/messageReadTime";
  import type { IMessage } from "$lib/types/IMessage";
  import { get } from "svelte/store";

  onMount(async () => {
    //console.log("/channel/[id] :: onMount : $page.params.id->", $page.params.id);
    // ユーザー一覧が取得されるまで待つ
    while ($userListStore.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await getChannelHistory();
    const MessageContainer = document.getElementById("messageContainer");

    //スクロール監視
    MessageContainer?.addEventListener("scroll", scrollHandler);

    //既読時間を更新させてみる
    await updateReadTime(
      $page.params.id,
      $channelHistoryStore.history[0]?.createdAt,
      false,
    );

    //既読時間のところまでスクロールする
    $channelHistoryStore.history.forEach((message) => {
      if (message.createdAt === $MessageReadTimeBeforeStore[$page.params.id]) {
        document.getElementById("message::" + message.id)?.scrollIntoView();
        return;
      }
    });

    window.addEventListener("focus", readItOnPageVisible);
  });

  $: (async () => {
    //console.log("/channel/[id] :: $ : page.params.id->", $page.params.id);
    if ($page.params.id) {
      await getChannelHistory();

      //既読時間を更新させてみる
      await updateReadTime(
        get(page).params.id,
        get(channelHistoryStore).history[0]?.createdAt,
        false,
      );
      //既読時間のところまでスクロールする
      get(channelHistoryStore).history.forEach((message) => {
        if (
          message.createdAt ===
          get(MessageReadTimeBeforeStore)[get(page).params.id]
        ) {
          document.getElementById("message::" + message.id)?.scrollIntoView();
          return;
        }
      });
    }
  })();

  onDestroy(() => {
    window.removeEventListener("focus", readItOnPageVisible);
  });

  /**
   * タブのアクティブが切り替わったら既読処理をする
   */
  const readItOnPageVisible = () => {
    console.log("/channel/[id] :: readItOnPageVisible");
    updateReadTime(
      $page.params.id,
      $channelHistoryStore.history[0]?.createdAt,
      false,
    );
  };

  /**
   * 日付が変わったかどうかを判定
   * @param currentMessage
   */
  const isDateChanged = (currentMessage: IMessage): boolean => {
    // 前の投稿の日付と比較
    const currentMessageDate = $channelHistoryStore.history.find(
      (message) => message.id === currentMessage.id,
    );
    // currentMessageDateのindexを取得
    const currentMessageDateIndex = $channelHistoryStore.history.findIndex(
      (message) => message.id === currentMessage.id,
    );
    // currentMessageDateの前の投稿の日付を取得
    const previousMessageDate = $channelHistoryStore.history.find(
      (message, index) => index === currentMessageDateIndex + 1,
    );
    // 日付が変わったかどうか
    if (currentMessageDate && previousMessageDate) {
      return (
        new Date(currentMessageDate.createdAt).toLocaleDateString() !==
        new Date(previousMessageDate.createdAt).toLocaleDateString()
      );
    } else {
      return false;
    }
  };

  /**
   * 前と同じメッセージ送信者かどうか
   * @param index
   */
  const displayAvatar = (message: IMessage): boolean => {
    // 前の投稿の日付と比較
    const currentMessageIndex = $channelHistoryStore.history.findIndex(
      (m) => m.id === message.id,
    );
    const currentMessage = $channelHistoryStore.history[currentMessageIndex];
    // currentMessageDateの前の投稿の日付を取得
    const previousMessage =
      $channelHistoryStore.history[currentMessageIndex + 1];

    //前のメッセージがない場合はfalse
    if (!previousMessage) return true;
    //日付が違う場合はfalse
    if (isDateChanged(currentMessage)) {
      return true;
    }
    //ひとつ前と今のメッセージの時差が５分以内ならfalse
    if (
      currentMessage.createdAt.valueOf() - previousMessage.createdAt.valueOf() <
      1000 * 60 * 5
    ) {
      return false;
    }
    //同じユーザーの場合はtrue
    if (currentMessage && previousMessage) {
      return currentMessage.userId !== previousMessage.userId;
    } else {
      return true;
    }
  };

  let hoverMessageID: string = "";

  const onHover = (id: string) => {
    //console.log(`hoverChanged ${hoverMessageID} to ${id} `);
    hoverMessageID = id;
  };
  const onEndHover = () => {
    //console.log(`hoverClear ${hoverMessageID} `);
    hoverMessageID = "";
  };
</script>

<div class="h-full w-full flex flex-col px-1 pb-2">
  <div
    id="messageContainer"
    class="flex-grow flex flex-col-reverse overflow-y-auto"
  >
    {#each $channelHistoryStore.history as message, index}
      {#if message.createdAt === $MessageReadTimeBeforeStore[$page.params.id] && index !== 0}
        <NewMessageLine />
      {/if}

      <div
        class="flex p-2 items-start mb-4 gap-2 w-full hover:bg-base-300"
        role="log"
        id={"message::" + message.id}
        on:mouseover={() => onHover(message.id)}
        on:mouseout={() => onEndHover()}
        on:focus={() => onHover(message.id)}
        on:blur={() => onEndHover()}
      >
        {#if displayAvatar(message)}
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <div class="dropdown dropdown-right dropdown-end w-[50px]">
            <!-- アイコン表示 -->
            <div tabindex={index} role="button" class="w-15">
              <div
                class="avatar {$onlineUserListStore.find(
                  (v) => v === message.userId,
                ) !== undefined
                  ? 'online'
                  : 'offline'} "
              >
                <div class="w-8 rounded-full">
                  <img src="/api/user/icon/{message.userId}" alt="userIcon" />
                </div>
              </div>
            </div>
            <div
              tabindex={index}
              class="shadow m-0 p-0 card card-compact dropdown-content bg-base-100 rounded-box w-64 z-40"
            >
              <UserProfile userId={message.userId} />
            </div>
          </div>
        {/if}

        <div
          class={`flex flex-col gap-1 w-full ${!displayAvatar(message) ? "ml-[50px]" : null}`}
        >
          {#if displayAvatar(message)}
            <!-- ユーザー名、日付表示 -->
            <div class="flex gap-2 items-center">
              <span class="font-bold text-sm">
                {$userListStore.find((user) => user.id === message.userId)
                  ?.name}
              </span>

              <span class="text-xs text-gray-500"
                >{formatDate(message.createdAt)}</span
              >
            </div>
          {/if}

          <!-- メッセージ -->
          <div class="break-words break-all">
            {@html linkify(message.content)}
          </div>

          <!-- URLプレビュー -->
          {#if message.MessageUrlPreview && message.MessageUrlPreview.length > 0}
            <div class="mt-2 p-2 border rounded-lg">
              {#each message.MessageUrlPreview as preview}
                <div class="md:flex flex-row">
                  <div class="md:ml-4 md:flex-grow md:min-w-0 md:basis-1/2">
                    <a
                      href={preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-700 md:flex-shrink-0 break-words break-all"
                    >
                      <img
                        src={preview.faviconLink}
                        alt="Favicon"
                        class="inline w-4 h-4 mr-1"
                      />
                      {preview.title}
                    </a>
                    <div class="md:ml-4 md:flex-grow md:min-w-0 md:max-w-100">
                      <p class="break-words break-all">{preview.description}</p>
                    </div>
                  </div>
                  {#if preview.imageLink}
                    <div
                      class="h-30 sm:h-20 md:h-40 md:w-fit overflow-hidden md:ml-4"
                    >
                      <img
                        src={preview.imageLink}
                        alt={`Preview image for ${preview.title}`}
                        class="mt-2 w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          <!-- ファイル添付表示 -->
          {#if message.MessageFileAttached && message.MessageFileAttached.length > 0}
            <div class="flex flex-col gap-1 rounded-lg md:max-w-lg">
              {#each message.MessageFileAttached as fileData}
                <FilePreview {fileData} />
              {/each}
            </div>
          {/if}
        </div>
        <!-- ホバーメニュー -->
        <HoverMenu
          messageId={message.id}
          hoverMessageId={hoverMessageID}
          isLast={index === 0}
        />
      </div>

      <!-- 日付変更線 -->
      {#if isDateChanged(message)}
        <div class="flex items-center justify-center my-4">
          <hr class="border-t border-gray-300 w-full" />
          <span class="px-2 text-gray-500 text-sm">
            {new Date(message.createdAt).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
          <hr class="border-t border-gray-300 w-full" />
        </div>
      {/if}
    {/each}
  </div>
  <div class="flex gap-1">
    <MessageInput on:sendMessage={sendMessage} />
  </div>
</div>

<style>
  /* サイドバーとかぶってしまうため */
  /* 暫定対応 */
  .avatar.offline:before {
    z-index: 0 !important;
  }
  .avatar.online:before {
    z-index: 0 !important;
  }
</style>
