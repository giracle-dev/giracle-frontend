<script lang="ts">
    import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
    import {toastStore} from "$lib/store/toast.js";
    import { messageDeleteStore } from "$lib/store/messageDelete"
    import {onMount} from "svelte";

    const messageRepository = repositoryFactory.get("message");

    let messageId:string = "";
    let deleteModal: HTMLDialogElement;

    messageDeleteStore.subscribe((value)=>{
        messageId = value;
        deleteModal?.showModal();
    });

    onMount(()=>{
        deleteModal = document.getElementById("deleteModal") as HTMLDialogElement;
    })

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
</script>

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