<script>
  import { toastStore } from "$lib/store/toast";

  toastStore.subscribe((value) => {
    if (value) {
      console.log(value);
      setTimeout(() => {
        if (value.length > 0) {
          //配列の先頭を削除
          toastStore.update((value) => {
            value.shift();
            return value;
          });
        }
      }, 1000);
    }
  });
</script>

<div class="toast toast-top toast-end z-30">
  {#each $toastStore as toast}
    {#if toast.type === "info"}
      <div class="alert alert-info">
        <span>{toast.message}</span>
      </div>
    {:else if toast.type === "error"}
      <div class="alert alert-error">
        <span>toast.message</span>
      </div>
    {:else if toast.type === "success"}
      <div class="alert alert-success">
        <span></span>
      </div>
    {/if}
  {/each}
</div>
