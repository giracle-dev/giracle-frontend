<script lang="ts">
  import { goto } from "$app/navigation";
  import { myRolePowerStore } from "$lib/store/myRolePower";
  import {
    IconUser,
    IconCirclesRelation,
    IconMailFilled,
    IconServer,
    IconHomeCog,
    IconDeviceFloppy,
  } from "@tabler/icons-svelte";
  import { get } from "svelte/store";

  const version = __VERSION__;
</script>

<div class="m-2 flex flex-col">
  <h3 class="w-full font-bold">基本設定</h3>
  <div class="flex items-center gap-5 m-5">
    <div class=" flex flex-col">
      <button
        class="btn btn-ghost mx-auto btn-circle"
        onclick={() => {
          goto("/setting/profile-setting");
        }}
      >
        <IconUser size={16} />
      </button>
      <div class="text-xs">プロフィール</div>
    </div>
    <div class=" flex flex-col">
      <button
        class="btn btn-ghost mx-auto btn-circle"
        onclick={() => {
          goto("/setting/client-setting");
        }}
      >
        <IconHomeCog size={16} />
      </button>
      <div class="text-xs">クライアント設定</div>
    </div>
  </div>

  {#if get(myRolePowerStore).manageRole || get(myRolePowerStore).manageServer}
    <h3 class="w-full font-bold">サーバー管理設定</h3>
  {/if}
  <div class="flex items-center gap-5 m-5">
    {#if get(myRolePowerStore).manageServer}
      <div class=" flex flex-col">
        <button
          class="btn btn-ghost mx-auto btn-circle"
          onclick={() => {
            goto("/setting/server-manage");
          }}
        >
          <IconServer size={16} />
        </button>
        <div class="text-xs">サーバー管理</div>
      </div>
      <div class=" flex flex-col">
        <button
          class="btn btn-ghost mx-auto btn-circle"
          onclick={() => {
            goto("/setting/storage-manage");
          }}
        >
          <IconDeviceFloppy size={16} />
        </button>
        <div class="text-xs">ストレージ管理</div>
      </div>
    {/if}

    {#if get(myRolePowerStore).manageRole || get(myRolePowerStore).manageServer}
      <div class=" flex flex-col">
        <button
          class="btn btn-ghost mx-auto btn-circle"
          onclick={() => {
            goto("/setting/role-setting");
          }}
        >
          <IconCirclesRelation size={16} />
        </button>
        <div class="text-xs">ロール管理</div>
      </div>
    {/if}

    {#if get(myRolePowerStore).manageServer}
      <div class=" flex flex-col">
        <button
          class="btn btn-ghost mx-auto btn-circle"
          onclick={() => {
            goto("/setting/invite-setting");
          }}
        >
          <IconMailFilled size={16} />
        </button>
        <div class="text-xs">招待管理</div>
      </div>
    {/if}
  </div>

  <p class="mt-10 text-right text-sm">
    バージョン :
    <code>{version}</code>
  </p>
</div>
