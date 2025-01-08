<script lang="ts">
  import ChannelJoinedUser from "$lib/components/channel/ChannelInfoSidebar/ChannelJoinedUser.svelte";
  import { page } from "$app/stores";
  import { channelListStore } from "$lib/store/channel";
  import { get } from "svelte/store";
  import ChannelManage from "$lib/components/channel/ChannelInfoSidebar/ChannelManage.svelte";
  import { myRolePowerStore } from "$lib/store/myRolePower";

  let displayMode: "JOINED_USERS" | "MANAGE_PANEL" = $state("JOINED_USERS");
  let isDisplayed = false;
</script>

<div class="absolute drawer drawer-end">
  <input id="channel-drawer" type="checkbox" class="drawer-toggle" />
  <!--
    <div class="drawer-content flex flex-col items-center justify-center">
      <label for="channel-drawer" class="btn btn-primary drawer-button">
        Open drawer
      </label>
    </div>
  -->
  <div class="drawer-side">
    <label
      for="channel-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
    ></label>
    <ul
      class="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col gap-4"
    >
      <!-- Sidebar content here -->
      <div class="card truncate bg-base-100 w-full py-3 px-4">
        <div class="card-title">
          # {$channelListStore.find((c) => c.id === $page.params.id)?.name}
        </div>
      </div>

      <div class="join mx-auto w-full">
        <button
          onclick={() => (displayMode = "JOINED_USERS")}
          class={`btn w-1/2 join-item ${displayMode === "JOINED_USERS" ? "btn-primary" : ""}`}
          >参加者</button
        >
        <button
          onclick={() => (displayMode = "MANAGE_PANEL")}
          class={`btn w-1/2 join-item ${displayMode === "MANAGE_PANEL" ? "btn-primary" : ""}`}
          disabled={!$myRolePowerStore.manageChannel &&
            !$myRolePowerStore.manageServer}>管理</button
        >
      </div>

      <div class="card h-full w-full bg-base-100 z-0 py-3 px-4">
        {#if displayMode === "JOINED_USERS"}
          <ChannelJoinedUser channelId={$page.params.id} />
        {/if}
        {#if displayMode === "MANAGE_PANEL"}
          <ChannelManage channelId={$page.params.id} />
        {/if}
      </div>
    </ul>
  </div>
</div>
