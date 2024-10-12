<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { IconSearch, IconPlus } from "@tabler/icons-svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  const channelRepository = repositoryFactory.get("channel");
  let my_modal_5: HTMLDialogElement;
  let channelName = "";
  onMount(() => {
    my_modal_5 = document.getElementById("my_modal_5") as HTMLDialogElement;
  });

  const channelCreate = async () => {
    await channelRepository
      .createChannel(channelName)
      .then((response) => {
        if (response) {
          console.log("チャンネル作成に成功しました！");
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
