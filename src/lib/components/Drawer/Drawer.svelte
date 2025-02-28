<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    IconSettings,
    IconPointFilled,
    IconSearch,
    IconMail,
    IconArchive,
  } from "@tabler/icons-svelte";
  import { goto } from "$app/navigation";
  import { myUserStore, onlineUserListStore } from "$lib/store/user";
  import { inboxStore } from "$lib/store/inbox";
  import type { IChannel } from "$lib/types/IChannel";
  import { page } from "$app/state";
  import { serverInfoStore } from "$lib/store/serverInfo";
  import { hasNewMessageStore } from "$lib/store/messageReadTime";

  interface Props {
    openDrawer?: boolean;
    channelList: IChannel[];
    children?: import("svelte").Snippet;
  }

  let {
    openDrawer = $bindable(false),
    channelList,
    children,
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleDrawer() {
    dispatch("drawer");
  }
</script>

<div class="drawer md:drawer-open w-full">
  <input
    id="my-drawer-2"
    type="checkbox"
    class="drawer-toggle"
    bind:checked={openDrawer}
    onchange={handleDrawer}
  />
  <div class="drawer-content w-full">
    {@render children?.()}
  </div>

  <!-- ここからサイドバー -->
  <div class="drawer-side">
    <label
      for="my-drawer-2"
      aria-label="close sidebar"
      class="drawer-overlay flex flex-col"
    ></label>
    <div class="flex flex-col bg-base-200 text-base-content h-full w-60 p-2">
      <div
        class=" relative flex items-center justify-between h-[64px] md:h-[100px] bg-[url('/api/server/banner')] bg-center bg-cover"
      >
        <div
          class="absolute top-0 px-1 text-primary-content text-xl font-bold w-full bg-opacity-70 bg-base-300"
        >
          {$serverInfoStore.name}
        </div>
      </div>
      <div class="text-sm p-2">オンラインユーザー</div>
      <div class="avatar-group -space-x-6 rtl:space-x-reverse h-10">
        {#each $onlineUserListStore as onlineUser, index}
          <div class="avatar">
            <div class="w-8">
              <img src={"/api/user/icon/" + onlineUser} alt="Avatar" />
            </div>
          </div>
        {/each}
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-8">
            <span>{$onlineUserListStore.length}</span>
          </div>
        </div>
      </div>

      <!-- ボーダー -->
      <div class="border-t border-base-300 my-2"></div>

      <!-- チャンネルボタン -->
      <ul class="grow overflow-y-auto py-2 w-full shrink">
        <a href="/channel" onclick={handleDrawer}>
          <li class="hover:bg-neutral rounded-md px-4 py-3 md:px-4 md:py-2">
            チャンネル一覧
          </li>
        </a>
        {#if channelList && channelList.length > 0}
          {#each channelList as channel}
            {#if $myUserStore.ChannelJoin && $myUserStore.ChannelJoin.find((c) => c.channelId === channel.id)}
              <li>
                <a
                  href="/channel/{channel.id}"
                  onclick={handleDrawer}
                  class="flex flex-row items-center px-4 py-3 md:px-4 md:py-2 hover:bg-neutral rounded-md"
                >
                  <div class="truncate">{channel.name}</div>

                  <div class="flex flex-row items-center ml-auto gap-1">
                    {#if channel.isArchived}
                      <IconArchive class="text-warning" />
                    {/if}
                    {#if $inboxStore.some((inbox) => inbox.Message.channelId === channel.id)}
                      <IconPointFilled class="text-error" />
                    {/if}
                    {#if !$inboxStore.some((inbox) => inbox.Message.channelId === channel.id) && $hasNewMessageStore[channel.id]}
                      <IconPointFilled />
                    {/if}
                    {#if channel.id === page.params.id}
                      <span class="badge badge-primary">&larr;</span>
                    {/if}
                  </div>
                </a>
              </li>
            {/if}
          {/each}
        {/if}
      </ul>

      <!-- インボックス -->
      <a href="/inbox">
        <div
          class={`${page.url.pathname === "/inbox" ? "bg-primary text-primary-content" : "hover:bg-base-300"} rounded-lg p-3 flex flex-row items-center gap-3`}
        >
          <IconMail size={20} />
          <p>通知</p>
          {#if $inboxStore.length > 0}
            <span class="ml-auto badge badge-primary">{$inboxStore.length}</span
            >
          {/if}
        </div>
      </a>

      <!-- search -->
      <a href="/search">
        <div
          class={`${page.url.pathname === "/search" ? "bg-primary text-primary-content" : "hover:bg-base-300"} rounded-lg p-3 flex flex-row items-center gap-3`}
        >
          <IconSearch size={20} />
          <p>検索</p>
        </div>
      </a>

      <!-- user -->
      <div class="bg-base-700 pa-2 flex items-center gap-2 h-[64px]">
        <details class="dropdown dropdown-top flex-1">
          <summary
            tabindex="0"
            class="flex gap-2 items-center m-1 p-0 cursor-pointer"
          >
            <img
              src={"/api/user/icon/" + $myUserStore.id}
              alt="user"
              class="w-10 h-10 rounded-full object-cover"
            />
            <span class=" truncate">
              {$myUserStore.name}
            </span>
          </summary>
          <div
            class=" dropdown-content bg-base-100 rounded-md z-[1] w-56 shadow"
          >
            <div class="bg-base p-2">
              <div class="relative w-full h-[100px]">
                <div
                  class="bg-primary w-full h-[80px] rounded-tl-lg rounded-tr-lg"
                >
                  <img
                    src={"/api/user/banner/" + $myUserStore.id}
                    alt="banner"
                    class="object-cover w-full h-[80px] rounded-tl-lg rounded-tr-lg"
                  />
                </div>
                <div class="avatar online absolute bottom-0 left-1">
                  <div class="w-10 rounded-full relative">
                    <img
                      src={"/api/user/icon/" + $myUserStore.id}
                      alt="user"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                  </div>

                  <button
                    class="rounded-full absolute top-0 left-0 right-0 bottom-0 m-0 p-0"
                    onclick={(event) => {
                      event.stopPropagation();
                      handleDrawer();
                      goto("/setting/profile-setting");
                    }}
                  >
                  </button>
                </div>
              </div>

              <div class="flex flex-col">
                <div class="text-lg font-bold">{$myUserStore.name}</div>
                <div class="text-sm">{$myUserStore.selfIntroduction}</div>
              </div>
            </div>
          </div>
        </details>
        <div class="flex gap-2">
          <button
            class="btn btn-ghost btn-circle"
            onclick={(event) => {
              event.stopPropagation();
              handleDrawer();
              goto("/setting");
            }}
          >
            <IconSettings size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
