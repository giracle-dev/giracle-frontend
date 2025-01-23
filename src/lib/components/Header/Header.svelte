<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    IconTextWrapDisabled,
    IconListSearch,
    IconLayoutSidebarLeftCollapseFilled,
  } from "@tabler/icons-svelte";


  interface Props {
    headerTitle?: string;
    headerIcon?: any;
  }

  let { headerTitle = "None Title", headerIcon = "channelList" as "channel" | "channelList" }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleDrawer() {
    dispatch("drawer");
  }

  //チャンネルサイドバーを展開する
  const openChannelSidebarPROXY = () => {
    const el = document.getElementById("channel-drawer") as HTMLInputElement;
    if (!el) return;
    el.checked = true;
  };
</script>

<div class="navbar h-8 w-full">
  <div class="flex-none lg:hidden">
    <button class="px-2" onclick={handleDrawer}>
      <IconTextWrapDisabled size={20} />
    </button>
  </div>
  <div class="mx-2 flex-1 px-2">
    {#if headerIcon === "channel"}
      #
    {/if}
    {#if headerIcon === "channelList"}
      <IconListSearch size={20} />
    {/if}
    {headerTitle}
  </div>
  <div class="flex-none lg:block">
    <ul class="menu menu-horizontal">
      <!-- Navbar menu content here -->
      {#if headerIcon === "channel"}
        <button
          onclick={openChannelSidebarPROXY}
          class="btn btn-square btn-ghost"
        >
          <IconLayoutSidebarLeftCollapseFilled />
        </button>
      {/if}
    </ul>
  </div>
</div>
