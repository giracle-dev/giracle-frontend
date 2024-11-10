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
</script>

<div class="container px-2 pt-2 h-full max-w-[1150px] mx-auto overflow-y-auto">
  {#if $inboxStore.length === 0}
    <div class="text-center text-xl text-gray-500">通知はありません</div>
  {/if}
  {#each $inboxStore as inboxItem, index}
    <CompactMessageRender message={inboxItem.Message} />
  {/each}
</div>
