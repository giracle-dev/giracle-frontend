<script lang="ts">
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { myUserStore } from "$lib/store/user";
  import { inboxStore } from "$lib/store/inbox";
  import { page } from "$app/stores";
  import { serverInfoStore } from "$lib/store/serverInfo";
  import { hasNewMessageStore } from "$lib/store/messageReadTime";
  import { channelListStore } from "$lib/store/channel";
  import { onlineUserListStore } from "$lib/store/user";
  import { createEventDispatcher } from "svelte";
  import { goto } from "$app/navigation";
  import {
    IconSettings,
    IconPointFilled,
    IconSearch,
    IconMail,
  } from "@tabler/icons-svelte";
  import type { IChannel } from "$lib/types/IChannel";
  import CompactMessageRender from "$lib/components/unique/CompactMessageRender.svelte";

  let groupByChannel: boolean = false;
</script>

<div class="container px-2 pt-2 h-full max-w-[1150px] mx-auto overflow-y-auto">
  <div class="form-control">
    <label class="label cursor-pointer">
      <span class="label-text">チャンネルで分ける</span>
      <input type="checkbox" bind:checked={groupByChannel} class="checkbox" />
    </label>
  </div>

  {#if $inboxStore.length === 0}
    <div class="text-center text-xl text-gray-500">通知はありません</div>
  {/if}

  {#if groupByChannel}
    {#each $channelListStore as channel}
      {#if $inboxStore.some((item) => item.Message.channelId === channel.id)}
        <a
          href="/channel/{channel.id}"
          class="flex items-center gap-2 p-2 hover:bg-base-100"
        >
          <div class="text-xl mb-2 text-gray-500"># {channel.name}</div>
        </a>
        <div class="flex flex-col gap-1">
          {#each $inboxStore.filter((item) => item.Message.channelId === channel.id) as inboxItem, index}
            <CompactMessageRender message={inboxItem.Message} />
          {/each}
        </div>
        <div class="divider" />
      {/if}
    {/each}
  {:else}
    <div class="flex flex-col gap-2">
      {#each $inboxStore as inboxItem, index}
        <CompactMessageRender message={inboxItem.Message} />
      {/each}
    </div>
  {/if}
</div>
