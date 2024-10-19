<script lang="ts">
  import { page } from "$app/stores";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { channelHistoryStore } from "$lib/store/channelHistory";
  import { userListStore } from "$lib/store/user";
  import {
    formatDate,
    getChannelHistory,
    scrollHandler,
  } from "./channelMessage";
  import { onMount } from "svelte";
  import UserProfile from "$lib/components/unique/userProfile.svelte";
  const messageRepository = repositoryFactory.get("message");

  let message = "";

  onMount(async () => {
    console.log("/channel/[id] :: $page.params.id->", $page.params.id);
    await getChannelHistory();
    const MessageContainer = document.getElementById("messageContainer");
    console.log(MessageContainer);
    MessageContainer?.addEventListener("scroll", scrollHandler);
  });

  $: (async () => {
    console.log("/channel/[id] :: $page.params.id->", $page.params.id);
    await getChannelHistory();
  })();

  /**
   * メッセージを送信する
   */
  const sendMessage = async () => {
    if (message === "") return;
    await messageRepository
      .sendMessage($page.params.id, message)
      .then((res) => {
        console.log("/channel/[id] :: sendMessage : res->", res);
      });

    //メッセージを初期化
    message = "";
    // メッセージ入力欄にフォーカスを当てる
    document.getElementById("messageInput")?.focus();
  };

  /**
   * enterキーが押された時にメッセージを送信する
   * @param event
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault(); // デフォルトの動作を防ぐ
      sendMessage();
    }
  }
</script>

<div class="h-full w-full flex flex-col px-1 pb-2">
  <div
    id="messageContainer"
    class="flex-grow flex flex-col-reverse overflow-y-auto"
  >
    {#each $channelHistoryStore.history as message, index}
      <div class="flex p-2 items-start mb-4 gap-2 w-full hover:bg-base-300">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div class="dropdown dropdown-right dropdown-end">
          <div tabindex={index} role="button" class="w-8">
            <img
              src={"/api/user/icon/" + message.userId}
              alt="avatar"
              class="avater rounded-full w-8 h-8 object-cover"
            />
          </div>
          <div
            tabindex={index}
            class="shadow m-0 p-0 card card-compact dropdown-content bg-base-100 rounded-box w-64"
          >
            <UserProfile userId={message.userId} />
          </div>
        </div>

        <div class="flex flex-col gap-1 w-full">
          <div class="flex gap-2 items-center">
            <span class="font-bold text-sm">
              {$userListStore.find((user) => user.id === message.userId)?.name}
            </span>

            <span class="text-xs text-gray-500"
              >{formatDate(message.createdAt)}</span
            >
          </div>
          <div class="message-text">{message.content}</div>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex gap-1">
    <input
      id="messageInput"
      bind:value={message}
      type="text"
      placeholder="メッセージを送信"
      class="input input-bordered w-full flex-grow"
      on:keydown={handleKeyDown}
    />
    <button on:click={sendMessage} class="btn">送信</button>
  </div>
</div>
