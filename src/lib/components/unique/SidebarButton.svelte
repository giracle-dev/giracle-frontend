<script lang="ts">
  import { openDrawer } from "$lib/store/drawer";
  import { IconTextWrapDisabled } from "@tabler/icons-svelte";

  let { _class = "" }: { _class?: string } = $props();

  /**
   * Giracle全体用のサイドバー(左)を展開する
   */
  function handleDrawer() {
    openDrawer.update((v) => !v);
  }
</script>

<button class={`px-2 ${_class}`} onclick={handleDrawer}>
  <IconTextWrapDisabled size={20} />
</button>
