<script lang="ts">
  import { ws } from "$lib/wsHandler/INIT.ws";
  import { myUserStore } from "$lib/store/myuser";
  import { get } from "svelte/store";
  import { page } from "$app/stores";

  let message = "";

  /**
   * メッセージを送信する
   */
  const sendMessage = () => {
    ws.send(
      JSON.stringify({
        signal: "message::SendMessage",
        data: {
          channelId: $page.params.id,
          content: message,
        },
      }),
    );
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
