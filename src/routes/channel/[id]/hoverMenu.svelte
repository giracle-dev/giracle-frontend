<script lang="ts">
import {IconDots} from "@tabler/icons-svelte";
import DeleteMessageModal from "./deleteMessageModal.svelte"
import {onMount} from "svelte";



export let messageId: string = '';
export let hoverMessageId: string = '';
export let isLast:boolean = false;

let isDisplayDeleteModal:boolean = false;
let isHoverDropDown:boolean = false;


onMount(()=>{
    console.log(isLast + " :" +messageId);
})
</script>

<div
        class="join join-horizontal indicator -top-7 right-0 pr-7 {messageId === hoverMessageId || isHoverDropDown ? '' : 'hidden' } "
>
    <div class="dropdown {isLast ? 'dropdown-top':'dropdown-bottom'} dropdown-left">
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
                <button class="text-error" on:click={() => isDisplayDeleteModal = true}
                >メッセージを削除</button
                >
            </li>
        </ul>
    </div>
</div>

{#if isDisplayDeleteModal}
    <DeleteMessageModal messageId={messageId} />
{/if}
