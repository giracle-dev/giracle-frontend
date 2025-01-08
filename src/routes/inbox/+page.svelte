<script lang="ts">
  import { inboxStore } from "$lib/store/inbox";
  import { channelListStore } from "$lib/store/channel";
  import CompactMessageRender from "$lib/components/unique/CompactMessageRender.svelte";
  import { ReadInboxItem } from "$lib/utils/ReadInboxItem";
  import { get } from "svelte/store";

  let groupByChannel: boolean = $state(true);
  let processing = $state(false);

  /**
   * 指定のチャンネルの通知を全て既読にする
   * @param channelId
   */
  const readWholeChannel = async (channelId: string) => {
    processing = true;
    const items = get(inboxStore).filter(
      (item) => item.Message.channelId === channelId,
    );
    for (const item of items) {
      await ReadInboxItem(item.Message.id);
    }
    processing = false;
  };
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
        <div class="flex items-center">
          <div class="text-xl truncate mb-2 text-gray-500">
            <a href="/channel/{channel.id}" class="flex items-center gap-2 p-2">
              # {channel.name}
            </a>
          </div>
          <button
            onclick={() => readWholeChannel(channel.id)}
            class="ml-auto btn btn-primary btn-sm"
            disabled={processing}>既読する</button
          >
        </div>

        <div class="flex flex-col gap-1">
          {#each $inboxStore.filter((item) => item.Message.channelId === channel.id) as inboxItem, index}
            <CompactMessageRender message={inboxItem.Message} />
          {/each}
        </div>

        <div class="divider"></div>
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
