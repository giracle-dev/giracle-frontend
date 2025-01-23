<script lang="ts">
  import { IconDots } from "@tabler/icons-svelte";
  import {toastStore} from "$lib/store/toast";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  interface Props {
    messageId?: string;
    hoverMessageId?: string;
    isLast?: boolean;
  }

  let { messageId = "", hoverMessageId = "", isLast = false }: Props = $props();

  const messageRepository = repositoryFactory.get("message");
  let isDisplayDeleteModal: boolean = $state(false);
  let isHoverDropDown: boolean = $state(false);
  let deleteModal:HTMLDialogElement | undefined = $state();

  const deleteMessage = async (messageId :string)=>{
    console.log("deleting");
    await messageRepository
      .deleteMessage(messageId)
      .then((response) => {
        console.log("メッセージ削除成功",response);
        deleteModal?.close();
        toastStore.update((toast) =>{
          return [
            ...toast,
            {
              message: "メッセージを削除しました。",
              type: "success",
            }
          ]
        })
      })
      .catch((response) =>{
        console.log("メッセージ削除失敗",response);
        deleteModal?.close();
        toastStore.update((toast) =>{
          return [
            ...toast,
            {
              message: "メッセージを削除できませんでした。",
              type: "error",
            },
          ];
        });
      });
  }

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
        onfocus={() => {
          isHoverDropDown = true;
        }}
        onblur={() => {
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
            onclick={() =>{
               console.log("OnClick Delete id:"+ hoverMessageId +"isDisplayDeleteModal:"+ isDisplayDeleteModal);
               isDisplayDeleteModal = true;
               deleteModal?.showModal();
            }}
            >メッセージを削除</button
          >
        </li>
      </ul>
    </div>
  </div>
</div>

{#if isDisplayDeleteModal}
  <dialog bind:this={deleteModal} id="deleteModal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-lg font-bold">メッセージを削除</h3>
      <p class="py-4">メッセージを削除します。よろしいですか?</p>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">キャンセル</button>
        </form>
        <button class="btn" onclick={()=> deleteMessage(messageId)}>削除する</button>
      </div>
    </div>
  </dialog>
{/if}
