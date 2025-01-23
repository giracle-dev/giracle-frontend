<script lang="ts">
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import type { IChannel } from "$lib/types/IChannel";
  import { IconX } from "@tabler/icons-svelte";
  const channelRepository = repositoryFactory.get("channel");

  let result: IChannel[] = $state([]); //検索結果格納用
  let query = $state(""); //検索クエリ
  interface Props {
    selection?: IChannel[];
  }

  let { selection = $bindable([]) }: Props = $props();

  /**
   * チャンネルを検索する
   */
  const searchChannel = () => {
    channelRepository
      .searchChannel(query)
      .then((res) => {
        console.log(
          "SearchChannelAndSelect :: searchChannel : res.data->",
          res.data,
        );
        result = res.data;
      })
      .catch((e) => {
        console.error("SearchChannelAndSelect :: searchChannel : エラー->" + e);
      });
  };

  const controlChannelData = (channelInserting: IChannel) => {
    //選択されたチャンネルが既に選択されている場合は削除
    const cIndex = selection.findIndex((c) => c.id === channelInserting.id);
    if (cIndex !== -1) {
      //selection.splice(cIndex, 1);
      selection = selection.filter((c) => c.id !== channelInserting.id);
      return;
    }

    //選択されたチャンネルを追加
    selection = [...selection, channelInserting];
  };
</script>

<div class="card rounded-lg bg-base-100 p-2 flex flex-col gap-1">
  {#if result.length !== 0}
    <div
      class="absolute left-0 bottom-full border w-full max-h-[250px] overflow-y-auto bg-white shadow-lg rounded-lg z-10"
    >
      {#each result as channel}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          role="button"
          class="p-2 hover:bg-neutral bg-base-200 cursor-pointer"
          onclick={() => controlChannelData(channel)}
          tabindex={0}
        >
          {channel.name}
        </div>
      {/each}
      {#if result.length === 0}
        <div class="p-2 text-gray-500">チャンネルが見つかりませんでした。</div>
      {/if}
    </div>
  {/if}

  <div class="flex flex-row overflow-x-auto items-center pt-1 gap-1">
    {#each selection as channel}
      <div class="badge badge-lg badge-neutral gap-2">
        {channel.name}
        <button
          onclick={() => {
            controlChannelData(channel);
          }}
        >
          <IconX size={16} />
        </button>
      </div>
    {/each}
    {#if selection.length === 0}
      <span class="mx-auto">チャンネルが選択されていません。</span>
    {/if}
  </div>

  <div class="divider my-1"></div>

  <div class="flex flex-row gap-2 w-full items-center">
    <input
      bind:value={query}
      type="text"
      onfocusout={() => (result = [])}
      placeholder="チャンネルを検索する"
      class="input w-full grow bg-base-200"
    />
    <button onclick={searchChannel} class="btn btn-primary">検索</button>
  </div>
</div>
