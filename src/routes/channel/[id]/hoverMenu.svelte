<script lang="ts">
import {IconDots} from "@tabler/icons-svelte";
import { messageDeleteStore } from "$lib/store/messageDelete"



export let messageId: string = '';
export let hoverMessageId: string = '';

let isHoverDropDown:boolean = false;
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
                        on:click={() => messageDeleteStore.set(messageId)}
                >メッセージを削除</button
                >
            </li>
        </ul>
    </div>
</div>

