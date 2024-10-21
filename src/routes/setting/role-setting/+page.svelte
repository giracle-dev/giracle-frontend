<script lang="ts">
  import { goto } from "$app/navigation";
  import CreateRole from "$lib/components/role-setting/CreateRole.svelte";
  import DeleteRole from "$lib/components/role-setting/DeleteRole.svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { toastStore } from "$lib/store/toast";
  import type { IRole } from "$lib/types/IRole";
  import {
    IconSettings,
    IconPointFilled,
    IconTools,
    IconInfoCircleFilled,
    IconLockFilled,
    IconPlus,
  } from "@tabler/icons-svelte";
  import { onMount } from "svelte";

  const roleRepository = repositoryFactory.get("role");

  //ロール一覧
  let roles: IRole[] = [];
  //設定中のロール
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
  //ロール設定が変更されたか
  let roleConfigChanged = false;
  //ロール更新中フラグ
  let processing = false;
  $: {
    const roleOriginal = roles.find((role) => role.id === roleConfiguring.id);
    roleConfigChanged =
      JSON.stringify(roleConfiguring) !== JSON.stringify(roleOriginal);
  }

  //ロール作成ダイアログを開く用
  let PROXYopenCreateRoleDialog = () => {};
  let PROXYopenDeleteRoleDialog = (role: IRole) => {};

  //ロールを更新する
  const updateRole = async () => {
    processing = true;
    await roleRepository
      .updateRole({ roleId: roleConfiguring.id, roleData: roleConfiguring })
      .then((res) => {
        console.log("/setting/role-setting :: updateRole : res->", res.data);
        //ロールを再取得
        fetchRoles();
      })
      .catch((err) => {
        console.log("/setting/role-setting :: updateRole : res->", err);
        //トースト表示
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "ロール情報を更新できませんでした",
              type: "error",
            },
          ];
        });
      });
    processing = false;
  };

  //設定変更用ロール変数を元に戻す
  const restoreRoleConfig = () => {
    const roleOriginal = roles.find((role) => role.id === roleConfiguring.id);
    if (roleOriginal === undefined) return;

    roleConfiguring = structuredClone(roleOriginal);
    roleConfigChanged = false;
  };

  const fetchRoles = async () => {
    await roleRepository
      .getRoleList()
      .then((res) => {
        //console.log("/setting/role-setting :: fetchRoles : res->", res.data);
        roles = res.data;
        if (roleConfiguring.id === "")
          roleConfiguring = structuredClone(roles[0]);
        roleConfigChanged = false;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onMount(() => {
    fetchRoles();
  });
</script>

<div class="p-2 flex flex-col gap-5 mx-auto max-w-[1050px] h-screen">
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
      <button
        on:click={PROXYopenCreateRoleDialog}
        class="btn btn-primary btn-square ml-auto md:hidden"
      >
        <IconPlus size={20} />
      </button>
    </div>
  </div>

  <div class="card bg-base-200 md:hidden shrink-0 p-3 overflow-y-auto">
    <p class="my-2">管理するロール</p>
    <select value={roleConfiguring.name} class="select select-bordered w-full">
      {#each roles as role}
        <option
          on:click={() => (roleConfiguring = structuredClone(role))}
          value={role.name}
          class="rounded-md"
        >
          <span style={`color:${role.color};`}>
            {role.name}
          </span>
        </option>
      {/each}
    </select>
  </div>

  <div class="card bg-base-200 h-full overflow-y-auto flex flex-row gap-3 grow">
    <!-- サイドバー -->
    <div
      class="w-4/12 flex flex-col hidden overflow-y-auto h-full p-2 pb-6 md:inline gap-1"
    >
      {#each roles as role}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          on:click={() => {
            roleConfiguring = structuredClone(role);
            roleConfigChanged = false;
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

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        on:click={PROXYopenCreateRoleDialog}
        class="card bg-neutral flex flex-row gap-2 items-center self-end mt-1 cursor-pointer px-2 py-3 text-left w-full"
      >
        <IconPlus size={20} />
        新規ロールを作成
      </span>
    </div>

    <!-- ロール設定部分 -->
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
      <div class="mt-3 flex flex-row justify-end gap-2 pb-3">
        <button
          on:click={() => PROXYopenDeleteRoleDialog(roleConfiguring)}
          disabled={processing}
          class="btn btn-error"
        >
          削除
        </button>
        <div class="divider divider-horizontal" />
        <button
          on:click={restoreRoleConfig}
          disabled={!roleConfigChanged || processing}
          class="btn">元に戻す</button
        >
        <button
          on:click={updateRole}
          disabled={!roleConfigChanged || processing}
          class="btn btn-success">設定を更新する</button
        >
      </div>
    </div>
  </div>
</div>

<CreateRole
  display={false}
  bind:openCreateRoleDialog={PROXYopenCreateRoleDialog}
/>
<DeleteRole
  display={false}
  bind:openDeleteRoleDialog={PROXYopenDeleteRoleDialog}
/>
