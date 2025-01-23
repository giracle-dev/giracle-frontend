<script lang="ts">
  import { page } from "$app/state";
  import { channelHistoryStore } from "$lib/store/channelHistory";
  import {
    onlineUserListStore,
    userListStore,
    myUserStore,
  } from "$lib/store/user";
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
  import {
    MessageReadTimeBeforeStore,
    MessageReadTimeStore,
  } from "$lib/store/messageReadTime";
  import type { IMessage } from "$lib/types/IMessage";
  import { get } from "svelte/store";
  import { ReadInboxItem } from "$lib/utils/ReadInboxItem";
  import ChannelInfoSidebar from "./ChannelInfoSidebar.svelte";
  import { channelListStore } from "$lib/store/channel";
  import { myRolePowerStore } from "$lib/store/myRolePower";
  import SystemMessage from "./SystemMessage.svelte";
  import { IconLockOpen2 } from "@tabler/icons-svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { toastStore } from "$lib/store/toast";
  import ChannelHeader from "./ChannelHeader.svelte";
  const urlSearchParams = page.url.searchParams;

  let messageId = urlSearchParams.get("messageId");
  let alreadyMounted = $state(false);

  onMount(async () => {
    //console.log("/channel/[id] :: onMount : page.params.id->", page.params.id);
    // ユーザー一覧が取得されるまで待つ
    while ($userListStore.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    messageId = urlSearchParams.get("messageId");
    //既読時間
    const readTime = get(MessageReadTimeStore)[page.params.id];
    //履歴取得
    await getChannelHistory(
      undefined,
      readTime,
      "older",
      messageId || undefined,
    );
    const MessageContainer = document.getElementById("messageContainer");

    //スクロール監視
    MessageContainer?.addEventListener("scroll", scrollHandler);

    //既読時間を更新させてみる
    await updateReadTime(
      page.params.id,
      $channelHistoryStore.history[0]?.createdAt,
      false,
    );

    //既読時間のところまでスクロールする
    scrollToReadPos();

    window.addEventListener("focus", readItOnPageVisible);

    // スクロールバーがない場合、上下のメッセージを取得
    if (
      MessageContainer &&
      MessageContainer.scrollHeight === MessageContainer.clientHeight
    ) {
      const lastMessage =
        $channelHistoryStore.history[$channelHistoryStore.history.length - 1];
      const firstMessage = $channelHistoryStore.history[0];
      await getChannelHistory(lastMessage, undefined, "newer");
      await getChannelHistory(firstMessage, undefined, "older");
    }

    alreadyMounted = true;
  });

  $effect(() => {
    (async () => {
      console.log(
        "/channel/[id] :: $effect : page.params.id->",
        page.params.id,
      );
      //if (page.params.id) {
      if (alreadyMounted) {
        channelHistoryStore.update(() => ({
          history: [],
          atEnd: false,
          atTop: false,
        }));

        await getChannelHistory(
          undefined,
          get(MessageReadTimeStore)[page.params.id],
          "older",
        );

        //既読時間を更新させてみる
        await updateReadTime(
          page.params.id,
          get(channelHistoryStore).history[0]?.createdAt,
          false,
        );
        //既読時間のところまでスクロールする
        scrollToReadPos();
      }
    })();
  });

  onDestroy(() => {
    window.removeEventListener("focus", readItOnPageVisible);
  });

  /**
   * 既読時間のところまでスクロールする
   */
  const scrollToReadPos = () => {
    const readTimeIndex = $channelHistoryStore.history.findIndex(
      (message, index) =>
        message.createdAt === $MessageReadTimeStore[page.params.id],
    );
    if (
      readTimeIndex !== -1 &&
      $channelHistoryStore.history[readTimeIndex - 1] !== undefined
    ) {
      document
        .getElementById(
          "message::" + $channelHistoryStore.history[readTimeIndex - 1].id,
        )
        ?.scrollIntoView({
          block: "end",
        });
    }
  };

  /**
   * タブのアクティブが切り替わったら既読処理をする
   */
  const readItOnPageVisible = async () => {
    console.log("/channel/[id] :: readItOnPageVisible");
    await updateReadTime(
      page.params.id,
      $channelHistoryStore.history[0]?.createdAt,
      false,
    );
    //Inbox用の既読処理
    for (const message of get(channelHistoryStore).history) {
      await ReadInboxItem(message.id);
    }
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
   * 前と同じメッセージ送信者、あるいは５分以内の送信ならアバターを表示しないようにする
   * @param message - IMessage
   */
  const displayAvatar = (message: IMessage): boolean => {
    const currentMessageIndex = get(channelHistoryStore).history.findIndex(
      (m) => m.id === message.id,
    );
    const currentMessage =
      get(channelHistoryStore).history[currentMessageIndex];
    // currentMessageDateの前の投稿を取得
    const previousMessage =
      get(channelHistoryStore).history[currentMessageIndex + 1];

    //前のメッセージがない場合は表示
    if (!previousMessage) return true;
    //違うユーザーの場合は表示
    if (currentMessage.userId !== previousMessage.userId) return true;
    //日付が違う場合は表示
    if (isDateChanged(currentMessage)) {
      return true;
    }
    //ひとつ前と今のメッセージの時差が５分以上なら表示
    if (
      new Date(currentMessage.createdAt).valueOf() -
        new Date(previousMessage.createdAt).valueOf() >
      1000 * 60 * 5
    ) {
      return true;
    }

    return false;
  };

  /**
   * チャンネルをアーカイブ解除する
   */
  const unArchiveChannel = async () => {
    const channelRepository = repositoryFactory.get("channel");
    await channelRepository
      .updateChannel({ channelId: page.params.id, isArchived: false })
      .then(() => {
        //成功のトーストを出す
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "チャンネルのアーカイブ状態を解除しました。",
              type: "success",
            },
          ];
        });
      })
      .catch((err) => {
        //エラーのトーストを出す
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "チャンネルのアーカイブ解除に失敗しました。",
              type: "error",
            },
          ];
        });
        console.log("/channel/[id] :: unArchiveChannel : error->", err);
      });
  };

  let hoverMessageID: string = $state("");

  const onHover = (id: string) => {
    //console.log(`hoverChanged ${hoverMessageID} to ${id} `);
    hoverMessageID = id;
  };
  const onEndHover = () => {
    //console.log(`hoverClear ${hoverMessageID} `);
    hoverMessageID = "";
  };
</script>

<div class="flex grow flex-col px-1 pb-2 overflow-y-auto">
  <ChannelHeader
    headerTitle={$channelListStore.find((c) => c.id === page.params.id)?.name}
    isArchived={$channelListStore.find((c) => c.id === page.params.id)
      ?.isArchived}
  />

  <div id="messageContainer" class="grow flex flex-col-reverse overflow-y-auto">
    {#each $channelHistoryStore.history as message, index}
      {#if message.createdAt === $MessageReadTimeBeforeStore[page.params.id] && index !== 0}
        <NewMessageLine />
      {/if}

      <!-- メッセージ自体のレンダー -->
      {#if message.isSystemMessage}
        <SystemMessage {message} />
      {:else}
        <div
          class={`flex py-1 px-2 items-start w-full hover:bg-base-300 rounded-md ${message.content.includes("@<" + get(myUserStore).id + ">") ? "bg-neutral" : ""}`}
          role="log"
          id={"message::" + message.id}
          onmouseover={() =>
            $myRolePowerStore.manageServer ||
            get(myUserStore).id === message.userId
              ? onHover(message.id)
              : null}
          onmouseout={() => onEndHover()}
          onfocus={() =>
            $myRolePowerStore.manageServer ||
            get(myUserStore).id === message.userId
              ? onHover(message.id)
              : null}
          onblur={() => onEndHover()}
        >
          {#if displayAvatar(message)}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div class="dropdown dropdown-right dropdown-end shrink-0 w-[50px]">
              <!-- アイコン表示 -->
              <div tabindex={index} role="button" class="w-15 mx-auto">
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
              <div class="card bg-base-300 p-2 rounded-lg">
                {#each message.MessageUrlPreview as preview}
                  <div class="md:flex flex-row">
                    <div class="md:ml-4 md:grow md:min-w-0 md:basis-1/2">
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
                        <p class="break-words break-all">
                          {preview.description}
                        </p>
                      </div>
                    </div>
                    {#if preview.imageLink}
                      <div
                        class="h-30 sm:h-20 p-1 md:p-0 md:h-auto md:w-1/3 xl:w-1/5 md:ml-4"
                      >
                        <img
                          src={preview.imageLink}
                          alt={`Preview image for ${preview.title}`}
                          class="w-full h-full object-cover rounded-lg"
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
      {/if}
    {/each}

    {#if $channelHistoryStore.atTop}
      <p class="text-center mb-3 text-neutral-500">ここが最後</p>
    {/if}
  </div>

  <div class="flex gap-1">
    {#if $channelListStore.find((c) => c.id === page.params.id)?.isArchived}
      <div
        class="card flex flex-row justify-center items-center px-2 py-4 bg-base-200 w-full"
      >
        <p>このチャンネルはアーカイブされています</p>
        <button
          onclick={unArchiveChannel}
          class="btn btn-outline btn-secondary ml-auto"
        >
          <IconLockOpen2 />
          アーカイブ解除
        </button>
      </div>
    {:else}
      <MessageInput on:sendMessage={sendMessage} />
    {/if}
  </div>
</div>
<div>
  {#if $channelListStore.find((c) => c.id === page.params.id) !== undefined}
    <ChannelInfoSidebar />
  {/if}
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
