<script>
import {goto} from "$app/navigation";
import {IconSettings} from "@tabler/icons-svelte";
</script>

<div class="p-2 mx-auto max-w-[850px] flex flex-col gap-3">
  <div class="card bg-base-200 p-3 flex flex-row items-center">
    <button
            class="btn btn-ghost w-16"
            on:click={() => {
        goto("/setting");
      }}
    >
      <IconSettings size={20} />
    </button>
    <p class="card-title">ストレージ管理</p>
  </div>
</div>