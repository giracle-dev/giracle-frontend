<script lang="ts">
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import {
    IconSearch,
    IconClockCog,
    IconFileFilled,
    IconLink,
  } from "@tabler/icons-svelte";
  import type { IMessage } from "$lib/types/IMessage";
  import CompactMessageRender from "$lib/components/unique/CompactMessageRender.svelte";
  const messageRepository = repositoryFactory.get("message");

  let query = $state("");
  let hasUrlPreview: boolean | undefined = $state(undefined);
  let hasFileAttachment: boolean | undefined = $state(undefined);
  //let userId: string | undefined = undefined;
  let loadIndex = $state(1);
  let dateOrder: "desc" | "asc" = $state("desc");

  let result: IMessage[] = $state([]);
  let fetchResult: "success" | "error" | "-" = $state("-");
  let processing = $state(false);
  let hasMoreMessages = $state(false);

  const searchIt = async (continuousSearch: boolean = false) => {
    processing = true;
    await messageRepository
      .searchMessage({
        content: query,
        hasUrlPreview,
        hasFileAttachment,
        loadIndex,
        dateOrder,
      })
      .then((res) => {
        console.log("/search :: searchIt : res->", res);
        //連続検索なら結果を追加、そうでないなら上書き
        if (continuousSearch) {
          result = [...result, ...res.data];
        } else {
          result = res.data;
        }
        fetchResult = "success";

        //50件以上ある場合はもっと読み込むボタンを表示
        if (res.data.length === 50) {
          hasMoreMessages = true;
        } else {
          hasMoreMessages = false;
        }
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
    <div class="card-body flex flex-col gap-3">
      <div class="join join-horizontal">
        <input
          bind:value={query}
          type="text"
          placeholder="検索文字"
          class="grow input input-bordered join-item"
        />
        <button
          onclick={() => {
            loadIndex = 1;
            searchIt(false);
          }}
          class="btn btn-square btn-primary join-item"
        >
          <IconSearch size={16} />
        </button>
      </div>

      <!-- ここから検索条件指定 -->

      <div class="flex flex-col sm:flex-row items-center text-sm gap-1">
        <IconLink />
        <p class="truncate">URLプレビュー</p>
        <div class="join join-horizontal w-full sm:w-fit ml-auto">
          <button
            onclick={() => (hasUrlPreview = true)}
            class={`btn grow sm:grow-0 ${hasUrlPreview === true ? "btn-primary" : "btn-neutral"} join-item`}
            >必須</button
          >
          <button
            onclick={() => (hasUrlPreview = undefined)}
            class={`btn grow sm:grow-0 ${hasUrlPreview === undefined ? "btn-primary" : "btn-neutral"} join-item`}
            >-</button
          >
          <button
            onclick={() => (hasUrlPreview = false)}
            class={`btn grow sm:grow-0 ${hasUrlPreview === false ? "btn-primary" : "btn-neutral"} join-item`}
            >除外</button
          >
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center text-sm gap-1">
        <IconFileFilled />
        <p class="truncate">ファイル添付</p>
        <div class="join join-horizontal w-full sm:w-fit ml-auto">
          <button
            onclick={() => (hasFileAttachment = true)}
            class={`btn grow sm:grow-0 ${hasFileAttachment === true ? "btn-primary" : "btn-neutral"} join-item`}
            >必須</button
          >
          <button
            onclick={() => (hasFileAttachment = undefined)}
            class={`btn grow sm:grow-0 ${hasFileAttachment === undefined ? "btn-primary" : "btn-neutral"} join-item`}
            >-</button
          >
          <button
            onclick={() => (hasFileAttachment = false)}
            class={`btn grow sm:grow-0 ${hasFileAttachment === false ? "btn-primary" : "btn-neutral"} join-item`}
            >除外</button
          >
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center text-sm gap-1">
        <IconClockCog />
        <p class="truncate">時間ソート</p>
        <div class="join join-horizontal w-full sm:w-fit ml-auto">
          <button
            onclick={() => (dateOrder = "desc")}
            class={`btn grow sm:grow-0 ${dateOrder === "desc" ? "btn-primary" : "btn-neutral"} join-item`}
            >新しい順</button
          >
          <button
            onclick={() => (dateOrder = "asc")}
            class={`btn grow sm:grow-0 ${dateOrder === "asc" ? "btn-primary" : "btn-neutral"} join-item`}
            >古い順</button
          >
        </div>
      </div>

      <div class="divider"></div>

      <!-- ここから結果表示 -->
      <div class="flex flex-col gap-2">
        {#if fetchResult === "error"}
          <p class="text-center">結果を取得できませんでした...</p>
        {/if}
        {#if processing}
          <p class="text-center">処理中...</p>
          <progress class="progress w-3/4 mx-auto"></progress>
        {/if}
        {#if fetchResult === "success" && result.length === 0}
          <p class="text-center">結果がありません...</p>
        {/if}

        {#each result as message}
          <CompactMessageRender {message} />
        {/each}

        <!-- さらに読み込むボタン -->
        {#if hasMoreMessages}
          <button
            onclick={() => {
              loadIndex++;
              searchIt(true);
            }}
            class="btn btn-primary">もっと読み込む</button
          >
        {/if}
      </div>
    </div>
  </div>
</div>
