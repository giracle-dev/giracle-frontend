<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    IconSettings,
  } from "@tabler/icons-svelte";
</script>

<div class="p-2 flex flex-col gap-3 mx-auto max-w-[950px]">
  <div class="card bg-base-200 shadow-xl">
    <div class="card-body flex flex-row">
      <button
        class="btn btn-ghost w-16"
        on:click={() => {
          goto("/setting");
        }}
      >
        <IconSettings size={20} />
      </button>
      <h2 class="card-title">ロールの管理</h2>
    </div>
  </div>
</div>
