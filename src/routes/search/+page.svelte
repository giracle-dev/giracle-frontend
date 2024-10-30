<script lang="ts">
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { IconSearch } from "@tabler/icons-svelte";
  import type { IMessage } from "$lib/types/IMessage";
  import { userListStore } from "$lib/store/user";
  import FilePreview from "../channel/[id]/FilePreview.svelte";
  const messageRepository = repositoryFactory.get("message");

  let query = "";
  let hasUrlPreview: boolean | undefined = undefined;
  let hasFileAttachment: boolean | undefined = undefined;
  //let userId: string | undefined = undefined;
  let dateOrder: "desc" | "asc" = "desc";

  let result: IMessage[] = [];
  let fetchResult: "success" | "error" | "-" = "-";
  let processing = false;

  const searchIt = async () => {
    processing = true;
    await messageRepository
      .searchMessage({
        content: query,
        hasUrlPreview,
        hasFileAttachment,
        dateOrder,
      })
      .then((res) => {
        console.log("/search :: searchIt : res->", res);
        result = res.data;
        fetchResult = "success";
      })
      .catch((err) => {
        console.error("/search :: searchIt : err->", err);
        fetchResult = "error";
      });
    processing = false;
  };
</script>

<div class="px-2 pt-2 h-full max-w-[1150px] mx-auto overflow-y-auto">
  <div class="card bg-base-200">
    <div class="card-body">
      <div class="join join-horizontal">
        <input
          bind:value={query}
          type="text"
          placeholder="検索文字"
          class="grow input input-bordered join-item"
        />
        <button
          on:click={searchIt}
          class="btn btn-square btn-primary join-item"
        >
          <IconSearch size={16} />
        </button>
      </div>

      <div class="flex flex-row items-center">
        <p class="truncate">URLプレビュー</p>
        <div class="join join-horizontal ml-auto">
          <button
            on:click={() => (hasUrlPreview = true)}
            class={`btn ${hasUrlPreview === true ? "btn-primary" : "btn-neutral"} join-item`}
            >必須</button
          >
          <button
            on:click={() => (hasUrlPreview = undefined)}
            class={`btn ${hasUrlPreview === undefined ? "btn-primary" : "btn-neutral"} join-item`}
            >-</button
          >
          <button
            on:click={() => (hasUrlPreview = false)}
            class={`btn ${hasUrlPreview === false ? "btn-primary" : "btn-neutral"} join-item`}
            >除外</button
          >
        </div>
      </div>

      <div class="flex flex-row items-center">
        <p class="truncate">ファイル添付</p>
        <div class="join join-horizontal ml-auto">
          <button
            on:click={() => (hasFileAttachment = true)}
            class={`btn ${hasFileAttachment === true ? "btn-primary" : "btn-neutral"} join-item`}
            >必須</button
          >
          <button
            on:click={() => (hasFileAttachment = undefined)}
            class={`btn ${hasFileAttachment === undefined ? "btn-primary" : "btn-neutral"} join-item`}
            >-</button
          >
          <button
            on:click={() => (hasFileAttachment = false)}
            class={`btn ${hasFileAttachment === false ? "btn-primary" : "btn-neutral"} join-item`}
            >除外</button
          >
        </div>
      </div>

      <div class="flex flex-row items-center">
        <p class="truncate">時間ソート</p>
        <div class="join join-horizontal ml-auto">
          <button
            on:click={() => (dateOrder = "desc")}
            class={`btn ${dateOrder === "desc" ? "btn-primary" : "btn-neutral"} join-item`}
            >新しい順</button
          >
          <button
            on:click={() => (dateOrder = "asc")}
            class={`btn ${dateOrder === "asc" ? "btn-primary" : "btn-neutral"} join-item`}
            >古い順</button
          >
        </div>
      </div>

      <div class="divider" />

      <!-- ここから結果表示 -->
      <div class="flex flex-col gap-2">
        {#if fetchResult === "error"}
          <p class="text-center">結果を取得できませんでした...</p>
        {/if}
        {#if processing}
          <p class="text-center">処理中...</p>
          <progress class="progress w-3/4 mx-auto"></progress>
        {/if}

        {#each result as message}
          <div class="card bg-base-300 px-4 py-3 flex flex-col gap-2">
            <div class="flex flex-row items-center gap-2">
              <div class="w-8 rounded-full">
                <img src="/api/user/icon/{message.userId}" alt="userIcon" />
              </div>
              {$userListStore.find((user) => user.id === message.userId)?.name}
            </div>
            <p>{message.content}</p>

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
                    <a href={urlPreview.url} target="_blank"
                      >{urlPreview.title}</a
                    >
                    <p>{urlPreview.description}</p>
                  </div>
                </div>
              {/each}
            {/if}
            {#if message.MessageFileAttached}
              {#each message.MessageFileAttached as fileData}
                <span class="">
                  <FilePreview {fileData} forcedImageSize="150px" />
                </span>
              {/each}
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
