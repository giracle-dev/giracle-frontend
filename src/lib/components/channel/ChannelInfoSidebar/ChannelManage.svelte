<script lang="ts">
  import { channelListStore } from "$lib/store/channel";
  import { get } from "svelte/store";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import type { IChannel } from "$lib/types/IChannel";
  const channelRepository = repositoryFactory.get("channel");

  //props
  export let channelId: string;

  let currentChannelInfo: IChannel | undefined;
  //入力用
  let channelName: string;
  let channelDescription: string;
  let isChanged = false;

  /**
   * データ初期化
   */
  const initialize = () => {
    currentChannelInfo = structuredClone(get(channelListStore)).find(
      (c) => c.id === channelId,
    );
    channelName =
      get(channelListStore).find((c) => c.id === channelId)?.name || "";
    channelDescription =
      get(channelListStore).find((c) => c.id === channelId)?.description || "";
    checkChanged();
  };

  /**
   * 変化検知用
   */
  const checkChanged = () => {
    if (!currentChannelInfo) return;

    if (channelName !== currentChannelInfo.name) {
      isChanged = true;
    } else if (channelDescription !== currentChannelInfo.description) {
      isChanged = true;
    } else {
      isChanged = false;
    }
  };

  /**
   * チャンネル情報を更新する
   */
  const updateChannel = () => {
    if (!currentChannelInfo) return;

    channelRepository
      .updateChannel({
        channelId: currentChannelInfo.id,
        name: channelName,
        description: channelDescription,
      })
      .then((res) => {
        if (res) {
          isChanged = false;
        }
      })
      .catch((e) => {
        console.error("ChannelManage :: updateChannel : e->", e);
      });
  };

  //マウント時あるいはチャンネル移動時にデータ初期化実行
  $: channelId && initialize();
</script>

<div class="flex flex-col gap-4">
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">チャンネル名</span>
    </div>
    <input
      bind:value={channelName}
      on:input={checkChanged}
      type="text"
      placeholder="Random"
      class="input input-bordered w-full"
    />
  </label>

  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">概要</span>
    </div>
    <textarea
      bind:value={channelDescription}
      on:input={checkChanged}
      placeholder="なんでも雑談"
      class="textarea textarea-bordered w-full"
    />
  </label>

  <div class="flex flex-col gap-2">
    <button
      on:click={updateChannel}
      class="btn btn-primary"
      disabled={!isChanged}>適用</button
    >
    <button
      on:click={() => {
        channelName = currentChannelInfo?.name || "";
        channelDescription = currentChannelInfo?.description || "";
        checkChanged();
      }}
      class="btn"
      disabled={!isChanged}>元に戻す</button
    >
  </div>
</div>
