<script lang="ts">
  import { page } from "$app/stores";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  const messageRepository = repositoryFactory.get("message");
  const channelRepository = repositoryFactory.get("channel");

  let message = "";

  $: (async () => {
    console.log("/channel/[id] :: $page.params.id->", $page.params.id);
    await channelRepository
      .getHistory({ channelId: $page.params.id })
      .then((res) => {
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
</script>

<div class="h-full flex flex-col px-1 pb-2">
  <div class="flex-grow">ここでメッセージ表示</div>
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
