<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    IconUser,
    IconCirclesRelation,
    IconMailFilled,
    IconServer,
    IconHomeCog,
    IconDeviceFloppy,
  } from "@tabler/icons-svelte";

  const version = __VERSION__;
</script>

<div class="m-2 flex flex-col">
  <h3 class="w-full font-bold">基本設定</h3>
  <div class="flex items-center gap-5 m-5">
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
    <div class=" flex flex-col">
      <button
        class="btn btn-ghost mx-auto btn-circle"
        on:click={() => {
          goto("/setting/client-setting");
        }}
      >
        <IconHomeCog size={16} />
      </button>
      <div class="text-xs">クライアント設定</div>
    </div>
  </div>

  <h3 class="w-full font-bold">サーバー管理設定</h3>
  <div class="flex items-center gap-5 m-5">
    <div class=" flex flex-col">
      <button
        class="btn btn-ghost mx-auto btn-circle"
        on:click={() => {
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
        on:click={() => {
          goto("/setting/storage-manage");
        }}
      >
        <IconDeviceFloppy size={16} />
      </button>
      <div class="text-xs">ストレージ管理</div>
    </div>
    <div class=" flex flex-col">
      <button
        class="btn btn-ghost mx-auto btn-circle"
        on:click={() => {
          goto("/setting/role-setting");
        }}
      >
        <IconCirclesRelation size={16} />
      </button>
      <div class="text-xs">ロール管理</div>
    </div>
    <div class=" flex flex-col">
      <button
        class="btn btn-ghost mx-auto btn-circle"
        on:click={() => {
          goto("/setting/invite-setting");
        }}
      >
        <IconMailFilled size={16} />
      </button>
      <div class="text-xs">招待管理</div>
    </div>
  </div>

  <p class="text-right text-sm">
    バージョン :
    <code>{version}</code>
  </p>
</div>
