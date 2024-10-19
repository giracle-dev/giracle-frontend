<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { ws } from "$lib/wsHandler/INIT.ws";
  import { IconSearch, IconPlus } from "@tabler/icons-svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { channelListStore } from "$lib/store/channel";
  import type { IChannel } from "$lib/types/IChannel";
  import { myUserStore } from "$lib/store/user";
  import { IconDotsVertical } from "@tabler/icons-svelte";
  import { IconArchive } from "@tabler/icons-svelte";
  import { toastStore } from "$lib/store/toast";
  const channelRepository = repositoryFactory.get("channel");

  let my_modal_5: HTMLDialogElement;
  let processing: boolean = false;
  let channelName = "";
  let channels: IChannel[] = [];

  onMount(async () => {
    my_modal_5 = document.getElementById("my_modal_5") as HTMLDialogElement;

    processing = true;
    channels = (await channelRepository.getChannel()).data;
    processing = false;

    console.log("/channel :: channels->", channels);
  });

  /**
   * チャンネルへ参加する
   * @param channelId
   */
  const joinChannel = async (channelId: string) => {
    await channelRepository
      .joinChannel(channelId)
      .then((response) => {
        console.log(
          "/channel :: joinChannel : チャンネル参加に成功しました！",
          response,
        );
        myUserStore.update((user) => {
          user.ChannelJoin = [
            ...user.ChannelJoin,
            {
              channelId: channelId,
            },
          ];
          return user;
        });
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "チャンネルに参加しました。",
              type: "success",
            },
          ];
        });
      })
      .catch((error) => {
        console.error(
          "/channel :: joinChannel : チャンネルリスト取得に失敗しました。",
          error,
        );
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "チャンネルに参加に失敗しました。",
              type: "error",
            },
          ];
        });
      });
  };

  /**
   * チャンネルから脱退する
   * @param channelId
   */
  const leaveChannel = async (channelId: string) => {
    await channelRepository
      .leaveChannel(channelId)
      .then((response) => {
        console.log(
          "/channel :: leaveChannel : チャンネル脱退に成功しました！",
          response,
        );
        myUserStore.update((user) => {
          user.ChannelJoin = user.ChannelJoin.filter(
            (c) => c.channelId !== channelId,
          );
          return user;
        });
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "チャンネルから脱退しました。",
              type: "success",
            },
          ];
        });
      })
      .catch((error) => {
        console.error(
          "/channel :: leaveChannel : チャンネル脱退に失敗しました。",
          error,
        );
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "チャンネルから脱退に失敗しました。",
              type: "error",
            },
          ];
        });
      });
  };

  const channelCreate = async () => {
    await channelRepository
      .createChannel(channelName)
      .then(async (response) => {
        if (response) {
          console.log("チャンネル作成に成功しました！");
          await channelRepository
            .getChannel()
            .then((response) => {
              //表示しているチャンネルリストを更新
              channels = response.data;
              //チャンネルリストをストアに保存
              channelListStore.set(response.data);
              toastStore.update((toast) => {
                return [
                  ...toast,
                  {
                    message: "チャンネルを作成しました。",
                    type: "success",
                  },
                ];
              });
            })
            .catch((error) => {
              console.error("チャンネルリスト取得に失敗しました。", error);
            });
        } else {
          console.log("チャンネル作成に失敗しました。");
          toastStore.update((toast) => {
            return [
              ...toast,
              {
                message: "チャンネル作成に失敗しました。",
                type: "error",
              },
            ];
          });
        }
      })
      .catch((error) => {
        console.error("チャンネル作成に失敗しました。", error);
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "チャンネル作成に失敗しました。",
              type: "error",
            },
          ];
        });
      })
      .finally(() => {
        channelName = "";
      });
    console.log("channelCreate");
  };

  /**
   * アーカイブ設定をトグルする
   * @param channelId
   * @param value
   */
  const toggleArchiveChannel = async (channelId: string, value: boolean) => {
    await channelRepository
      .updateChannel({ channelId, isArchived: value })
      .then((res) => {
        console.log("/channel :: toggleArchiveChannel : res->", res);
      })
      .catch((error) => {
        console.error("/channel :: toggleArchiveChannel : error->", error);
      });
  };

  //更新されたチャンネルデータの受け取り
  const eventReceiver = (event: MessageEvent) => {
    const dat: {
      signal: string;
      data: IChannel;
    } = JSON.parse(event.data);
    console.log("/channel :: eventReceiver :: data->", dat);

    //signalが一致しているなら更新処理
    if (dat.signal === "channel::UpdateChannel") {
      //ループして一致するチャンネルデータを更新
      for (const index in channels) {
        if (channels[index].id === dat.data.id) {
          channels[index] = dat.data;
        }
      }
    }
  };
  ws.addEventListener("message", eventReceiver);

  onDestroy(() => {
    //イベントリスナーの削除
    ws.removeEventListener("message", eventReceiver);
  });

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
  <div class="mt-3 pb-3 flex flex-col gap-2">
    {#if processing}
      <progress class="progress w-full"></progress>
      <p class="text-center">処理中...</p>
    {/if}
    {#each channels as channel, index}
      <div class="w-full card shadow-xl">
        <div class="flex flex-row items-center p-2 px-8 gap-2">
          <div class="flex-1 divide-y divide-slate-700">
            <div class="flex items-center gap-2">
              <p class="font-bold">{channel.name}</p>
              {#if channel.isArchived}
                <span class="badge badge-warning gap-2">
                  <IconArchive size={15} />
                </span>
              {/if}
            </div>
            <p>{channel.description}asdf</p>
          </div>
          {#if !$myUserStore.ChannelJoin.find((c) => c.channelId === channel.id)}
            <button
              on:click={() => joinChannel(channel.id)}
              class="btn btn-outline">参加</button
            >
          {:else}
            <button
              on:click={() => leaveChannel(channel.id)}
              class="btn btn-error btn-link">脱退</button
            >
          {/if}
          <div class="dropdown dropdown-bottom dropdown-end">
            <button class="m-1 btn btn-ghost">
              <IconDotsVertical size={15} />
            </button>
            <ul
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              {#if !channel.isArchived}
                <li>
                  <button
                    on:click={() => toggleArchiveChannel(channel.id, true)}
                    class="btn btn-link"
                    aria-disabled={channel.isArchived}
                  >
                    archive
                  </button>
                </li>
              {:else}
                <li>
                  <button
                    on:click={() => toggleArchiveChannel(channel.id, false)}
                    class="btn btn-link"
                    aria-disabled={!channel.isArchived}
                  >
                    archive解除
                  </button>
                </li>
              {/if}
            </ul>
          </div>

          <!-- <div class="join">
            <button
              on:click={() => toggleArchiveChannel(channel.id, true)}
              disabled={channel.isArchived}
              class="btn btn-primary join-item">archive</button
            >
            <button
              on:click={() => toggleArchiveChannel(channel.id, false)}
              disabled={!channel.isArchived}
              class="btn btn-primary join-item">archive解除</button
            >
          </div> -->
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
