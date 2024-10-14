<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { ws } from "$lib/wsHandler/INIT.ws";
  import { IconSearch, IconPlus } from "@tabler/icons-svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { channelListStore } from "$lib/store/channel";
  import type { IChannel } from "$lib/types/IChannel";
  const channelRepository = repositoryFactory.get("channel");

  let my_modal_5: HTMLDialogElement;
  let channelName = "";
  let channels: IChannel[] = [];

  onMount(async () => {
    my_modal_5 = document.getElementById("my_modal_5") as HTMLDialogElement;

    channels = (await channelRepository.getChannel()).data;
    console.log("/channel :: channels->", channels);
  });

  /**
   * チャンネルへ参加する
   * @param channelId
   */
  const joinChannel = (channelId: string) => {
    ws.send(JSON.stringify({
      signal: "channel::JoinChannel",
      data: { channelId }
    }));
  }

  /**
   * チャンネルから脱退する
   * @param channelId
   */
  const leaveChannel = (channelId: string) => {
    ws.send(JSON.stringify({
      signal: "channel::LeaveChannel",
      data: { channelId }
    }));
  }

  const channelCreate = async () => {
    await channelRepository
      .createChannel(channelName)
      .then(async (response) => {
        if (response) {
          console.log("チャンネル作成に成功しました！");
          await channelRepository
            .getChannel()
            .then((response) => {
              channelListStore.set(response.data);
            })
            .catch((error) => {
              console.error("チャンネルリスト取得に失敗しました。", error);
            });
        } else {
          console.log("チャンネル作成に失敗しました。");
        }
      })
      .catch((error) => {
        console.error("チャンネル作成に失敗しました。", error);
      })
      .finally(() => {
        channelName = "";
      });
    console.log("channelCreate");
  };

  const deleteChannel = async (id: string) => {
    await channelRepository
      .deleteChannel(id)
      .then(async (response) => {
        if (response) {
          console.log("チャンネル削除に成功しました！");
          await channelRepository
            .getChannel()
            .then((response) => {
              channelListStore.set(response.data);
            })
            .catch((error) => {
              console.error("チャンネルリスト取得に失敗しました。", error);
            });
        } else {
          console.log("チャンネル削除に失敗しました。");
        }
      })
      .catch((error) => {
        console.error("チャンネル削除に失敗しました。", error);
      });
    console.log("deleteChannel");
  };
</script>

<div class="m-2">
  <div class="flex gap-2 w-full">
    <!-- 検索と作成ボタン -->
    <div class="flex flex-1">
      <input
        type="text"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-200 sm:text-sm"
        placeholder="検索"
      />
      <button
        class="px-4 py-2 text-white mx-1 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <IconSearch size={20} />
      </button>
    </div>
    <div>
      <button
        on:click={() => my_modal_5.showModal()}
        class="h-full flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <IconPlus size={20} class="md:mr-1" />
        <div class="hidden md:block">チャンネルを作成する</div>
      </button>
    </div>
  </div>
  <div class="mt-3 pb-3">
    {#each channels as channel}
      <div class="w-full card bg-base-200">
        <div class="flex flex-row item-center card-body">
          <p>{ channel.name }</p>
          <button on:click={()=>joinChannel(channel.id)} class="btn btn-primary">参加</button>
          <button on:click={()=>leaveChannel(channel.id)} class="btn btn-primary">脱退</button>
        </div>
      </div>
    {/each}
  </div>
</div>

<dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Press ESC key or click the button below to close</p>
    <input
      type="text"
      class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-200 sm:text-sm"
      placeholder="チャンネル名"
      bind:value={channelName}
    />
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <!-- チャンネル名入力 -->
        <button class="btn px-4 py-1">Close</button>
        <button
          class="btn px-4 py-1 {channelName === '' ? 'btn-disabled' : ''}"
          on:click={channelCreate}
        >
          作成
        </button>
      </form>
    </div>
  </div>
</dialog>
