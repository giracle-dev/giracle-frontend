<script lang="ts">
  import { IconDots } from "@tabler/icons-svelte";
  import { toastStore } from "$lib/store/toast";
  import { Picker } from "emoji-mart";
  import data from "@emoji-mart/data";
  export let messageId: string = "";
  export let hoverMessageId: string = "";
  export let isLast: boolean = false;
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { onMount } from "svelte";

  const messageRepository = repositoryFactory.get("message");
  let isDisplayDeleteModal: boolean = false;
  let isHoverDropDown: boolean = false;
  let deleteModal: HTMLDialogElement;

  let picker = null;

  const deleteMessage = async (messageId: string) => {
    console.log("deleting");
    await messageRepository
      .deleteMessage(messageId)
      .then((response) => {
        console.log("メッセージ削除成功", response);
        deleteModal.close();
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "メッセージを削除しました。",
              type: "success",
            },
          ];
        });
      })
      .catch((response) => {
        console.log("メッセージ削除失敗", response);
        deleteModal.close();
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "メッセージを削除できませんでした。",
              type: "error",
            },
          ];
        });
      });
  };

  onMount(() => {
    //絵文字リアクション用
    picker = new Picker({
      data: data,
      emojiSize: 24,
      title: "絵文字",
      emoji: "point_up",
      style: "native",
      set: "apple",
      showPreview: false,
      showSkinTones: false,
    });
  });
</script>

<div class="relative">
  <div
    class="indicator absolute -top-5 right-0 pr-7 {messageId ===
      hoverMessageId || isHoverDropDown
      ? ''
      : 'hidden'} "
  >
    <div
      class="dropdown {isLast
        ? 'dropdown-top'
        : 'dropdown-bottom'} dropdown-left"
    >
      <div
        class="btn btn-sm join-item px-2 py-0"
        role="button"
        tabindex="0"
        on:focus={() => {
          isHoverDropDown = true;
        }}
        on:blur={() => {
          isHoverDropDown = false;
        }}
      >
        <IconDots stroke={2} class="w-4" />
      </div>
      <ul
        tabindex="-1"
        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <button
            class="text-error"
            on:click={() => {
              console.log(
                "OnClick Delete id:" +
                  hoverMessageId +
                  "isDisplayDeleteModal:" +
                  isDisplayDeleteModal,
              );
              isDisplayDeleteModal = true;
              deleteModal.showModal();
            }}>メッセージを削除</button
          >
        </li>
      </ul>
    </div>
  </div>

  <!-- 絵文字リアクション用 -->
  <div class="absolute -top-5 right-0" bind:this={picker} />
</div>

{#if isDisplayDeleteModal}
  <dialog
    bind:this={deleteModal}
    id="deleteModal"
    class="modal modal-bottom sm:modal-middle"
  >
    <div class="modal-box">
      <h3 class="text-lg font-bold">メッセージを削除</h3>
      <p class="py-4">メッセージを削除します。よろしいですか?</p>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">キャンセル</button>
        </form>
        <button class="btn" on:click={() => deleteMessage(messageId)}
          >削除する</button
        >
      </div>
    </div>
  </dialog>
{/if}
