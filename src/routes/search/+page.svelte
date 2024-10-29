<script lang="ts">
  import {repositoryFactory} from "$lib/repositories/RepositoryFactory";
  import {IconSearch} from "@tabler/icons-svelte";
  import type {IMessage} from "$lib/types/IMessage";
  import { userListStore } from "$lib/store/user";
  import FilePreview from "../channel/[id]/FilePreview.svelte";
  const messageRepository = repositoryFactory.get("message");

  let query = "";
  let hasUrlPreview: boolean | undefined = undefined;
  let hasFileAttachment: boolean | undefined = undefined;
  let userId: string | undefined = undefined;

  let result: IMessage[] = [];

  const searchIt = async () => {
    await messageRepository
      .searchMessage({
        content: query,
        hasUrlPreview,
        hasFileAttachment,
      })
      .then((res) => {
        console.log("/search :: searchIt : res->", res);
        result = res.data;
      })
      .catch((err) => {
        console.error("/search :: searchIt : err->", err);
      });
  }
</script>

<div class="px-2 pt-2 h-full overflow-y-auto">
  <div class="card bg-base-200">
    <div class="card-body">

      <label class="input input-bordered flex items-center gap-2">
        <IconSearch size={20} />
        <input
          bind:value={query}
          type="text"
          placeholder="検索文字"
          class="grow"
        />
        <button on:click={searchIt}>検索</button>
      </label>

      <div class="flex flex-row items-center">
        <p class="truncate">URLプレビュー</p>
        <div class="join join-horizontal ml-auto">
          <button
            on:click={()=>hasUrlPreview = true}
            class={`btn ${hasUrlPreview===true ? "btn-primary" : "btn-neutral"} join-item`}
          >必須</button>
          <button
            on:click={()=>hasUrlPreview = undefined}
            class={`btn ${hasUrlPreview===undefined ? "btn-primary" : "btn-neutral"} join-item`}
          >-</button>
          <button
            on:click={()=>hasUrlPreview = false}
            class={`btn ${hasUrlPreview===false ? "btn-primary" : "btn-neutral"} join-item`}
          >除外</button>
        </div>
      </div>

      <div class="flex flex-row items-center">
        <p class="truncate">ファイル添付</p>
        <div class="join join-horizontal ml-auto">
          <button
            on:click={()=>hasFileAttachment = true}
            class={`btn ${hasFileAttachment===true ? "btn-primary" : "btn-neutral"} join-item`}
          >必須</button>
          <button
            on:click={()=>hasFileAttachment = undefined}
            class={`btn ${hasFileAttachment===undefined ? "btn-primary" : "btn-neutral"} join-item`}
          >-</button>
          <button
            on:click={()=>hasFileAttachment = false}
            class={`btn ${hasFileAttachment===false ? "btn-primary" : "btn-neutral"} join-item`}
          >除外</button>
        </div>
      </div>

      <div class="divider" />

      <div class="flex flex-col gap-2">
        {#each result as message}
          <div class="card bg-base-300">
            <div class="card-body">
              {$userListStore.find((user) => user.id === message.userId)?.name}
              <p>{message.content}</p>

              {#if message.MessageUrlPreview}
                {#each message.MessageUrlPreview as urlPreview}
                  <div class="card border px-2 py-2 flex flex-col sm:flex-row gap-1 items-center">
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
              {#if message.MessageFileAttached}
                {#each message.MessageFileAttached as fileData}
                  <span class="">
                    <FilePreview {fileData} forcedImageSize="150px" />
                  </span>
                {/each}
              {/if}
            </div>
          </div>
        {/each}
      </div>

    </div>
  </div>
</div>