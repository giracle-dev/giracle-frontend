<script lang="ts">
import {IconDots} from "@tabler/icons-svelte";
import {onMount} from "svelte";
import { toastStore } from "$lib/store/toast";
import { repositoryFactory } from "$lib/repositories/RepositoryFactory";

const messageRepository = repositoryFactory.get("message");

export let messageId: string = '';
export let hoverMessageId: string = '';

let isHoverDropDown:boolean = false;
let deleteModal: HTMLDialogElement;

const deleteMessage = async (messageId :string)=>{
    console.log("deleting");
    await messageRepository
        .deleteMessage(messageId)
        .then((response) => {
            console.log("メッセージ削除成功",response);
            deleteModal.close();
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
            deleteModal.close();
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

onMount(()=>{
    deleteModal = document.getElementById("deleteModal") as HTMLDialogElement;
})
</script>

<div
        class="join join-horizontal indicator -top-7 right-0 pr-7 {messageId === hoverMessageId || isHoverDropDown ? '' : 'hidden' } "
>
    <div class="dropdown dropdown-top dropdown-left">
        <div class="btn btn-sm join-item px-2 py-0"
             role="button"
             tabindex="0"
             on:focus ={()=>{isHoverDropDown = true;}}
             on:blur = {()=>{isHoverDropDown = false}}
        ><IconDots stroke={2} class="w-4" /></div
        >
        <ul
                tabindex="-1"
                class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"

        >
            <li>
                <button class="btn btn-sm btn-link hover:btn-neutral">返信</button>
            </li>
            <li>
                <button class="btn btn-sm  btn-link hover:btn-neutral">テキストをコピー</button>
            </li>
            <li>
                <button class="btn btn-sm btn-link hover:text-error"
                        on:click={() => deleteModal.showModal()}
                >メッセージを削除</button
                >
            </li>
        </ul>
    </div>
</div>
<dialog id="deleteModal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">メッセージを削除</h3>
        <p class="py-4">メッセージを削除します。よろしいですか?</p>
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">キャンセル</button>
            </form>
            <button class="btn" on:click={()=> deleteMessage(messageId)}>削除する</button>
        </div>
    </div>
</dialog>
