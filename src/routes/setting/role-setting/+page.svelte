<!-- @migration-task Error while migrating Svelte code: `<span>` is invalid inside `<option>` -->
<script lang="ts">
  import { ws } from "$lib/wsHandler/INIT.ws";
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
    IconUserFilled,
  } from "@tabler/icons-svelte";
  import { onDestroy, onMount } from "svelte";

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
  //ロール作成と削除用ダイアログ取り込み用
  let modalCreateRole: null | HTMLDialogElement = null;
  let modalDeleteRole: null | HTMLDialogElement = null;
  let roleToDelete: IRole = {
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
  $: {
    const roleOriginal = roles.find((role) => role.id === roleConfiguring.id);
    roleConfigChanged =
      JSON.stringify(roleConfiguring) !== JSON.stringify(roleOriginal);
  }

  //ロール作成ダイアログを開く用
  let PROXYopenCreateRoleDialog = () => {
    modalCreateRole?.showModal();
  };
  let PROXYopenDeleteRoleDialog = (role: IRole) => {
    roleToDelete = role;
    modalDeleteRole?.showModal();
  };

  //ロールを更新する
  const updateRole = async () => {
    processing = true;
    await roleRepository
      .updateRole({ roleId: roleConfiguring.id, roleData: roleConfiguring })
      .then((res) => {
        //console.log("/setting/role-setting :: updateRole : res->", res.data);
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

  //更新されたロールデータの受け取り、ここでは削除のみ
  const roleUpdateReceiver = (event: MessageEvent) => {
    const dat:
      | {
          signal: "role::Deleted";
          data: string;
        }
      | {
          signal: "role::Created";
          data: IRole;
        } = JSON.parse(event.data);

    //signalが一致しているなら更新処理
    //削除
    if (dat.signal === "role::Deleted") {
      //ループして一致するチャンネルデータを更新
      for (const index in roles) {
        if (roles[index].id === dat.data) {
          //削除
          let _roles = [...roles];
          _roles.splice(parseInt(index), 1);
          roles = _roles;
          //編集中ロールが削除された場合、最初のロールを編集中と設定
          roleConfiguring = structuredClone(roles[0]);

          return;
        }
      }
    }
    //作成
    if (dat.signal === "role::Created") {
      let _roles = [...roles];
      _roles.push(dat.data);
      roles = _roles;
    }
  };
  ws.addEventListener("message", roleUpdateReceiver);

  onMount(() => {
    fetchRoles();

    //ダイアログ達の取り込み
    modalCreateRole = document.getElementById(
      "createInvite",
    ) as HTMLDialogElement;
    modalDeleteRole = document.getElementById(
      "deleteRole",
    ) as HTMLDialogElement;
  });

  onDestroy(() => {
    ws.removeEventListener("message", roleUpdateReceiver);
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
          style={`color:${role.color};`}
        >
          {role.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="card bg-base-200 h-full overflow-y-auto flex flex-row gap-3 grow">
    <!-- サイドバー -->
    <div
      class="w-4/12 flex flex-col overflow-y-auto h-full p-2 pb-6 md:inline gap-1"
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
            <IconLockFilled size={20} class="ml-auto mr-2" />
          {/if}
          {#if role.id === "MEMBER"}
            <IconUserFilled size={20} class="ml-auto mr-2" />
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
      {#if roleConfiguring.id === "MEMBER"}
        <div role="alert" class="alert alert-info mb-3">
          <IconInfoCircleFilled size={24} />
          <span>MemberロールはHost以外の全員に適用されます。</span>
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
          disabled={processing ||
            roleConfiguring.id === "HOST" ||
            roleConfiguring.id === "MEMBER"}
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

<CreateRole />
<DeleteRole roleDeleting={roleToDelete} />
