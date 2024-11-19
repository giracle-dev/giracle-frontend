<script lang="ts">
  import ChannelJoinedUser from "$lib/components/channel/ChannelInfoSidebar/ChannelJoinedUser.svelte";
  import { page } from "$app/stores";
  import { channelListStore } from "$lib/store/channel";
  import { get } from "svelte/store";
  import ChannelManage from "$lib/components/channel/ChannelInfoSidebar/ChannelManage.svelte";

  let displayMode: "JOINED_USERS" | "MANAGE_PANEL" = "JOINED_USERS";
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

      <div class="join mx-auto">
        <button
          on:click={() => (displayMode = "JOINED_USERS")}
          class={`btn join-item ${displayMode === "JOINED_USERS" ? "btn-primary" : ""}`}
          >参加者</button
        >
        <button
          on:click={() => (displayMode = "MANAGE_PANEL")}
          class={`btn join-item ${displayMode === "MANAGE_PANEL" ? "btn-primary" : ""}`}
          >管理</button
        >
      </div>

      <div class="card overflow-y-auto h-full bg-base-100 py-3 px-4">
        {#if displayMode === "JOINED_USERS"}
          <ChannelJoinedUser />
        {/if}
        {#if displayMode === "MANAGE_PANEL"}
          <ChannelManage />
        {/if}
      </div>
    </ul>
  </div>
</div>
