<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let message = "";

  const dispatch = createEventDispatcher();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 &&
      event.keyCode === 229
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

<input
  bind:value={message}
  type="text"
  placeholder="メッセージを送信"
  class="input input-bordered w-full flex-grow"
  on:keydown={handleKeyDown}
/>
<button on:click={sendMessage} class="btn">送信</button>
