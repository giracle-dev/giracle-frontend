<script>
  import { page } from "$app/state";
</script>

{#if page.error}
  <h1>{page.error.message}</h1>
{:else}
  <h1>エラーが発生しました。</h1>
{/if}
