<script lang="ts">
  import { page } from "$app/stores";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { channelHistoryStore } from "$lib/store/channelHistory";
  import { userListStore } from "$lib/store/user";
  import { get } from "svelte/store";
  const messageRepository = repositoryFactory.get("message");
  const channelRepository = repositoryFactory.get("channel");

  let message = "";

  $: (async () => {
    console.log("/channel/[id] :: $page.params.id->", $page.params.id);
    await channelRepository
      .getHistory({ channelId: $page.params.id })
      .then((res) => {
        channelHistoryStore.set(res.data);
        console.log("/channel/[id] :: getHistory : res->", res);
      });
  })();

  /**
   * メッセージを送信する
   */
  const sendMessage = async () => {
    await messageRepository
      .sendMessage($page.params.id, message)
      .then((res) => {
        console.log("/channel/[id] :: sendMessage : res->", res);
      });

    //メッセージを初期化
    message = "";
  };

  /**
   *  ユーザー名を取得する
   */
  const getUserName = (userId: string) => {
    const getUserList = get(userListStore);
    const user = getUserList.find((user) => user.id === userId);
    return user?.name ?? "名無し";
  };

  /**
   *　日付をフォーマットする
   *  @param date
   * @returns "YYYY-MM-DD HH:mm:ss"
   */
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return year + "-" + month + "-" + day + " " + d.toLocaleTimeString();
  };
</script>

<div class="h-full flex flex-col px-1 pb-2">
  <div class="flex-grow flex flex-col-reverse overflow-y-auto">
    {#each $channelHistoryStore as message}
      <div class="flex items-start mb-4 gap-2 w-full">
        <img
          src={"/api/user/icon/" + message.userId}
          alt="avatar"
          class="avater rounded-full w-8 h-8 object-cover"
        />
        <div class="flex flex-col gap-1">
          <div class="flex gap-2 items-center">
            {getUserName(message.userId)}
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
      bind:value={message}
      type="text"
      placeholder="メッセージを送信"
      class="input input-bordered w-full flex-grow"
    />
    <button on:click={sendMessage} class="btn">送信</button>
  </div>
</div>
