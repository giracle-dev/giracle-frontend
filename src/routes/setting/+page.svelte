<script lang="ts">
  import { goto } from "$app/navigation";
  import { IconUser, IconSettings } from "@tabler/icons-svelte";
</script>

<div class="m-2">
  <h3 class="w-full font-bold">基本設定</h3>
  <div class="flex items-center gap-2 m-5">
    <div class=" flex flex-col">
      <button
        class="btn btn-ghost mx-auto btn-circle"
        on:click={() => {
          goto("/setting/profile-setting");
        }}
      >
        <IconUser size={16} />
      </button>
      <div class="text-xs">プロフィール</div>
    </div>
  </div>
</div>
