<script lang="ts">
  import { goto } from "$app/navigation";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import type { IRole } from "$lib/types/IRole";
  import {
    IconSettings,
    IconPointFilled,
    IconTools,
    IconInfoCircleFilled,
    IconLockFilled,
  } from "@tabler/icons-svelte";
  import { onMount } from "svelte";

  const roleRepository = repositoryFactory.get("role");

  let roles: IRole[] = [];
  let roleConfiguring: IRole = {
    id: "",
    name: "",
    createdAt: new Date(),
    createdUserId: "",
    color: "",
    manageServer: false,
    manageChannel: false,
    manageRole: false,
    manageUser: false,
  };

  const fetchRoles = async () => {
    await roleRepository
      .getRoleList()
      .then((res) => {
        console.log("/setting/role-setting :: fetchRoles : res->", res.data);
        roles = res.data;
        roleConfiguring = structuredClone(roles[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onMount(() => {
    fetchRoles();
  });
</script>

<div class="p-2 flex flex-col gap-5 mx-auto max-w-[950px] h-full">
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

  <div class="card bg-base-200 md:hidden p-3 overflow-y-auto h-full">
    <p class="my-2">管理するロール</p>
    <select bind:value={roleConfiguring} class="select select-bordered w-full">
      {#each roles as role}
        <option value={role} class="rounded-md">
          <span style={`color:${role.color};`}>
            <p>●</p>
            {role.name}
          </span>
        </option>
      {/each}
    </select>
  </div>

  <div class="card bg-base-200 flex flex-row grow">
    <div class="md:w-4/12 hidden p-2 md:inline flex flex-col gap-1">
      {#each roles as role}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          on:click={() => {
            roleConfiguring = structuredClone(role);
          }}
          class={`card flex flex-row items-center cursor-pointer px-2 py-3 text-left w-full ${role.id === roleConfiguring.id ? "bg-secondary font-bold shadow-md" : null}`}
        >
          <IconPointFilled size={28} color={role.color} />
          {role.name}
          {#if role.id === "HOST"}
            <IconLockFilled size={20} class="ml-auto" />
          {/if}
        </div>
      {/each}
    </div>

    <div class="grow px-3 py-3">
      {#if roleConfiguring.id === "HOST"}
        <div role="alert" class="alert alert-info mb-3">
          <IconInfoCircleFilled size={24} />
          <span>Hostロールを編集することはできません。</span>
        </div>
      {/if}
      <span class="text-xl mb-1 flex flex-row items-center gap-2">
        <IconInfoCircleFilled size={24} />
        基本情報
      </span>
      <div class="bg-base-100 card">
        <div class="card-body">
          <p>ロール名</p>
          <input
            type="text"
            class="input input-bordered"
            bind:value={roleConfiguring.name}
          />

          <span class="flex flex-row">
            <p>ロールカラー</p>
            <IconPointFilled size={28} color={roleConfiguring.color} />
          </span>
          <input
            type="text"
            class="input input-bordered"
            bind:value={roleConfiguring.color}
          />
        </div>
      </div>

      <span class="text-xl mt-3 mb-1 flex flex-row items-center gap-2">
        <IconTools size={24} />
        権限
      </span>
      <div class="bg-base-100 card">
        <div class="card-body">
          <label class="label cursor-pointer">
            <span class="label-text">ユーザーの管理</span>
            <input
              type="checkbox"
              class="toggle"
              bind:checked={roleConfiguring.manageUser}
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">チャンネルの管理</span>
            <input
              type="checkbox"
              class="toggle"
              bind:checked={roleConfiguring.manageChannel}
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">ロールの管理</span>
            <input
              type="checkbox"
              class="toggle"
              bind:checked={roleConfiguring.manageRole}
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">サーバー管理</span>
            <input
              type="checkbox"
              class="toggle"
              bind:checked={roleConfiguring.manageServer}
            />
          </label>
        </div>
      </div>
      <div class="mt-3 flex flex-row justify-end">
        <button class="btn">元に戻す</button>
        <button class="btn btn-success">設定を更新する</button>
      </div>
    </div>
  </div>
</div>
