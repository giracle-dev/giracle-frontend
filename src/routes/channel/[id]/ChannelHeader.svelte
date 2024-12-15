<script lang="ts">
  import { openDrawer } from "$lib/store/drawer";
  import {
    IconTextWrapDisabled,
    IconLayoutSidebarLeftCollapseFilled,
    IconArchive,
  } from "@tabler/icons-svelte";
  import { page } from "$app/stores";

  export let headerTitle: string = "";
  export let isArchived: boolean = false;

  /**
   * Giracle全体用のサイドバー(左)を展開する
   */
  function handleDrawer() {
    openDrawer.update((v) => !v);
  }

  //チャンネルサイドバー(右)を展開する
  const openChannelSidebarPROXY = () => {
    const el = document.getElementById("channel-drawer") as HTMLInputElement;
    if (!el) return;
    el.checked = true;
  };
</script>

<div class="bg-base-200 rounded-lg navbar h-8 w-full">
  <div class="flex-none lg:hidden">
    <button class="px-2" on:click={handleDrawer}>
      <IconTextWrapDisabled size={20} />
    </button>
  </div>
  <div class="mx-2 flex-1 px-2 flex items-center gap-2">
    {#if isArchived}
      <IconArchive />
    {:else}
      <p>#</p>
    {/if}
    <p>{headerTitle}</p>
  </div>
  {#if $page.params.id !== undefined}
    <div class="flex-none lg:block">
      <ul class="menu menu-horizontal">
        <button
          on:click={openChannelSidebarPROXY}
          class="btn btn-square btn-ghost"
        >
          <IconLayoutSidebarLeftCollapseFilled />
        </button>
      </ul>
    </div>
  {/if}
</div>
