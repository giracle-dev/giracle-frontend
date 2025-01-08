<script lang="ts">
  import { channelListStore } from "$lib/store/channel";
  import { userListStore } from "$lib/store/user";
  import type { IMessage } from "$lib/types/IMessage";
  import { linkify } from "../../../routes/channel/[id]/channelMessage";
  import FilePreview from "../../../routes/channel/[id]/FilePreview.svelte";

  interface Props {
    message: IMessage;
  }

  let { message }: Props = $props();
</script>

{#if message}
  <div class="card bg-base-300 px-4 py-3 flex flex-col">
    <!-- チャンネルと時間表示 -->
    <div class="flex flex-row w-full gap-2 overflow-x-auto items-center">
      <span class="badge shrink-0">
        {$channelListStore.find((channel) => channel.id === message.channelId)
          ?.name}
      </span>
      <span class="badge shrink-0 badge-neutral ml-auto">
        {new Date(message.createdAt).toLocaleString()}
      </span>
    </div>

    <!-- ユーザーとメッセージ本文 -->
    <div class="divider my-1"></div>
    <div class="flex flex-row items-center gap-2">
      <img
        src="/api/user/icon/{message.userId}"
        alt="userIcon"
        class="w-8 h-8 rounded-full object-cover"
      />
      {$userListStore.find((user) => user.id === message.userId)?.name}
    </div>

    <div class="my-2 break-words break-all">
      {@html linkify(message.content)}
    </div>

    <!-- URLプレビュー -->
    {#if message.MessageUrlPreview}
      {#each message.MessageUrlPreview as urlPreview}
        <div
          class="card border px-2 py-2 flex flex-col sm:flex-row gap-1 items-center"
        >
          <img
            src={urlPreview.imageLink}
            alt="urlPreview"
            class="h-min w-min max-h-[150px] max-w-[150px] rounded-lg"
          />
          <div>
            <a href={urlPreview.url} target="_blank">{urlPreview.title}</a>
            <p>{urlPreview.description}</p>
          </div>
        </div>
      {/each}
    {/if}
    <!-- 添付ファイル表示 -->
    {#if message.MessageFileAttached}
      {#each message.MessageFileAttached as fileData}
        <span class="">
          <FilePreview {fileData} forcedImageSize="150px" />
        </span>
      {/each}
    {/if}
  </div>
{/if}
