<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let message = "";
  let inputRows = 1; //入力部分の行数

  $: {
    //メッセージの改行に合わせて
    if (message.split("\n").length > 5) {
      inputRows = 5;
    } else if (message.split("\n").length < 1) {
      inputRows = 1;
    } else {
      inputRows = message.split("\n").length;
    }
  }

  const dispatch = createEventDispatcher();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      (navigator.platform.toUpperCase().indexOf("MAC") >= 0 &&
        event.keyCode === 229) ||
      event.shiftKey
    ) {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (message === "") return;
    dispatch("sendMessage", { message });
    message = "";
    message = message;
  };
</script>

<textarea
  bind:value={message}
  placeholder="メッセージを送信"
  class="textarea textarea-bordered w-full flex-grow"
  rows={inputRows}
  wrap="soft"
  on:keydown={handleKeyDown}
/>
<button on:click={sendMessage} class="btn">送信</button>
