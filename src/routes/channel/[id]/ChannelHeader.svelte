<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { openDrawer } from "$lib/store/drawer";
  import {
    IconTextWrapDisabled,
    IconLayoutSidebarLeftCollapseFilled,
  } from "@tabler/icons-svelte";
  import { page } from "$app/stores";

  export let headerTitle: string = "";

  const dispatch = createEventDispatcher();

  function handleDrawer() {
    openDrawer.update((v) => !v);
  }

  //チャンネルサイドバーを展開する
  const openChannelSidebarPROXY = () => {
    const el = document.getElementById("channel-drawer") as HTMLInputElement;
    if (!el) return;
    el.checked = true;
  };
</script>

<div class="bg-base-200 rounded-md navbar h-8 w-full">
  <div class="flex-none lg:hidden">
    <button class="px-2" on:click={handleDrawer}>
      <IconTextWrapDisabled size={20} />
    </button>
  </div>
  <div class="mx-2 flex-1 px-2">
    #
    {headerTitle}
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
